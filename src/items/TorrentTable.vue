<template>
	<section v-if="torrentList.length > 0" class="classic-results">
		<table class="torrent-results">
			<tr>
				<th>Nom</th>
				<th>Tags</th>
				<th>Taille</th>
				<th>Popularité</th>
				<th>Contrôles</th>
			</tr>

			<tr v-for="torrent in torrentList" v-bind:key="torrent.link">
				<td>
					<a class="torrent-link" :href="torrent.link">{{ torrent.name }}</a>
				</td>
				<td>
					<span v-for="tag in torrent.tags" v-bind:key="tag" class="chip">{{ tag }}</span>
				</td>
				<td>{{ torrent.size }}</td>
				<td>{{ popularity(torrent.completed, torrent.leech, torrent.seed) }} 🤘</td>
				<td>
					<button class="download-torrent fas fa-plus-circle" alt="Ajouter" title="Ajouter">
						<font-awesome-icon icon="plus-circle" />
					</button>
				</td>
			</tr>
		</table>
	</section>

	<section v-else-if="torrentList === false" class="classic-results no-results">
		<p>Aucun résultats 😭</p>
	</section>

	<section v-else class="classic-results loading">
		<p>Chargement...</p>
	</section>
</template>

<script>
import axios from 'axios';
import $ from 'jQuery';

window.$ = $;

function replaceAll(string, search, replacement) {
	return string.replace(new RegExp(search, 'g'), replacement);
}

function extractTags(name) {
	const data = {
		tags: [],
	};

	name = replaceAll(name, /\r?\n|\r/, '').trim();

	// store year specificaly
	const yearRegex = /\d{4}(?!p)/;
	const yearMatch = name.match(yearRegex);
	if (yearMatch != null) {
		data.year = parseInt(yearMatch[0], 10);
	}
	// remove the year
	name = name.replace(yearRegex, '');

	// handle tags with dots
	if (name.indexOf('5.1') !== -1) data.tags.push('5.1');
	if (name.indexOf('7.1') !== -1) data.tags.push('7.1');
	name = replaceAll(name, /((5\.1)|(7\.1))/, '');


	// replace parentheses brackets and dots by a space
	let rawTags = replaceAll(name, /[[\]().]/, ' ');

	const knowTags = [
		// resolution
		'1080p',
		'720p',
		'UHD',

		// language
		'VFQ',
		'VF2',
		'MULTi',
		'TRUEFRENCH',
		'FRENCH',

		// sound
		'DTS-HD',

		// codec
		'x264-gold',
		'x264',
		'HEVC',

		// source
		'BluRay',
	];

	knowTags.forEach((test) => {
		if (rawTags.indexOf(test) !== -1) {
			data.tags.push(test);
			rawTags = replaceAll(rawTags, test, '');
		}
	});

	data.name = rawTags.replace(/\s+/g, ' ');
	return data;
}

function parseRow(rowObj) {
	// rowObj keys : Type Nom NFO Comm. Age Taille Compl. Seed Leech
	const $torrentLink = $(rowObj.Nom).find('a');
	const rawName = $torrentLink.text();

	const data = extractTags(rawName);

	const row = {
		name: data.name,
		rawName,
		link: $torrentLink.attr('href'),
		age: rowObj.Age.innerHTML,
		size: rowObj.Taille.innerHTML,
		completed: parseInt(rowObj['Compl.'].innerHTML, 10),
		seed: parseInt(rowObj.Seed.innerHTML, 10),
		leech: parseInt(rowObj.Leech.innerHTML, 10),
		tags: data.tags,
		year: data.year,
	};

	return row;
}

function parseTable($table) {
	const headers = [];

	// get table headers
	$table.find('th').each((i, el) => {
		const $el = $(el);
		let name = $el.text();

		// some of them are links
		if (name.length === 0) {
			name = $el.find('a').text();
		}

		headers.push(name);
	});

	const array = [];

	// make each row an object with properties named from the headers
	$table.find('tbody tr').each((i, el) => {
		const cols = $(el).find('td');
		const row = {};

		// assign each td to its key
		headers.forEach((header, j) => {
			row[header] = cols[j];
		});

		// clean, extract and format the data
		const parsedRow = parseRow(row);

		array.push(parsedRow);
	});

	return array;
}

function parseYggSearch(html) {
	const virtualDom = $('<div></div>');
	virtualDom.html(html);

	const titles = virtualDom.find('section > h2').text();

	// check if the query returns nothing
	if (titles.indexOf('Aucun résultat') === -1) {
		const table = virtualDom.find('[id="#torrents"] table');
		if (table.length > 0) {
			const array = parseTable(table);

			return array;
		}
	}

	return false;
}

export default {
	name: 'TorrentTable',

	props: {
		title: String,
	},

	data() {
		return {
			torrentList: [],
		};
	},

	created() {
		this.load();
	},

	methods: {
		async load() {
			if (this.torrentList.length === 0) {
				const ygg = await axios.request({
					method: 'get',
					url: 'http://tbapi.dev.local/proxy.php',
					params: {
						do: 'search',
						name: this.title,
						sort: 'completed',
						order: 'desc',
					},
					dataType: 'html',
					headers: {
						'X-Proxy-Url': 'https://www2.yggtorrent.ch/engine/search/',
					},
					withCredentials: true,
				});

				this.torrentList = parseYggSearch(ygg.data);
			}
		},

		popularity(completed, leech, seed) {
			return completed + leech + seed;
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

table {
	width: 100%;
}

.chip {
	margin: 5px;
	padding: 5px 10px;
	border-radius: 22px;

	line-height: 1em;
	font-size: 12px;
	background-color: lightgrey;
	color: #3D3D3D;
}

.classic-results {

	td:nth-child(3) {
		text-align: right;
	}

	td:first-child,
	th:first-child {
		padding-left: 0;
	}

	td:last-child,
	th:last-child {
		padding-right: 0;
	}

	.download-torrent {
		font-size: 16px;

		margin: 0;
		padding: 0;
		border: none;

		background: none;
		cursor: pointer;
	}
}
</style>

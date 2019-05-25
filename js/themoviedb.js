class MovieAPI {
	constructor(key, plex, ygg) {
		this.key = key;
		this.plex = plex;
		this.ygg = ygg;
		this.url = "https://api.themoviedb.org/";
		this.version = 3;

		// config
		this.genres = {};

		// display settings
		this.method = 'discover';
		this.media = 'movie';
		this.sort = 'popularity.desc';

		this.init();
	}

	init() {
		this.request('/configuration', (data) => {
			this.config = data;

			this.request('/genre/movie/list', (data) => {
				this.genres.movie = data;

				this.request('/genre/tv/list', (data) => {
					this.genres.tv = data;

					this.update();
					this.setupListeners();
				});
			});
		});
	}

	request(action, success, data = {}) {
		data.api_key = this.key;

		$.ajax({
			url : 'proxy.php',
			data: data,
			dataType: "json",

			beforeSend: request => {
				request.setRequestHeader("X-Proxy-URL", this.url + this.version + action);
			},

			success: success,

			error: function() {
				if(window.debug) {
					console.log(action + ' error', arguments);
				}
			}
		});
	}

	update() {
		let container = $('.library-container')
		this.request('/' + this.method + '/' + this.media, (data) => {
			data.results.forEach((el) => {
				container.append(this.mediaCard(el));
			});

			this.match();
		}, {
			sort_by: this.sort,
			primary_release_year: 2018
		});
	}

	mediaCard(mlro) {
		/*
		{Movie List Result Object}
		poster_path			string or null
		adult				boolean
		overview			string
		release_date		string
		genre_ids			array[integer]
		id					integer
		original_title		string
		original_language	string
		title				string
		backdrop_path		string or null
		popularity			number
		vote_count			integer
		video				boolean
		vote_average		number
		*/
		let imageUrl = this.imageUrl(mlro.poster_path);
		let year = this.parseYear(mlro.release_date)

		return `
			<article class="media-card">
				<section class="media-card-content">
					<img class="media-owned" src="img/owned.svg"/>
					<div class="media-card-infos">
						<h1 class="media-title" title="${mlro.title}">${mlro.title}</h1>
						<h2 class="media-year">${year}</h2>
					</div>
					<canvas class="media-card-shadow"></canvas>
					<img class="media-poster" src="${imageUrl}"/>
				</section>

				<aside class="media-more">
					<div class="media-more-wrapper">
						<div class="tabs-select segmented">
							<label class="checked"><input type="radio" name="tabs-select" checked />Infos film</label>
							<label><input type="radio" name="tabs-select" />Ajout torrent</label>
							<label><input type="radio" name="tabs-select" />Ajout avancé</label>
						</div>
						<section class="film-info">
						</section>
						<section class="classic-results">
							<table class="torrent-results">
								<tr>
									<th>Nom</th>
									<th>Tags</th>
									<th>Popularité</th>
									<th>Contrôles</th>
								</tr>
							</table>
						</section>
						<section class="advanced-results"></section>
					</div>
				</aside>
			</article>
		`;
	}

	match() {
		if(this.plex.loaded != false) {
			$('.media-card').each((i, el) => {
				let title = $(el).find('.media-title').text();
				let year = $(el).find('.media-year').text();

				this.plex.search(title, (data) => {
					$(data).find('Video').each((i, video) => {
						if($(video).attr('title') == title && $(video).attr('year') == year) {
							$(el).addClass('match');
						}
					});
				});
			});
		}
	}

	parseYear(date) {
		let match = date.match(/(\d){4}/);
		if(match.length > 0) {
			return match[0];
		}
		return '';
	}

	imageUrl(path, size = 'w500') {
		// make sure https media is configured
		if(typeof this.config.images.secure_base_url === 'undefined') {
			return this.config.images.base_url + size + path;
		}

		// if no config is set you're fucked anyway
		return this.config.images.secure_base_url + size + path;
	}

	setupListeners() {
		$(document).on('click', '.media-card-content', e => {
			let $mediaCard = $(e.currentTarget).closest('.media-card');
			let isClosed = !$mediaCard.hasClass('open');

			$('.media-card').removeClass('open'); // close all

			if(isClosed) {
				$mediaCard.addClass('open loading');

				let title = $mediaCard.find('.media-title').text();

				this.ygg.searchTorrent(title, Ygg.SUB_CATEGORIES.VIDEO.FILM, results => {
					$mediaCard.find('.torrent-results').html(this.buildTable(results));
				}, () => {
					$mediaCard.find('.torrent-results').html('Aucun résultat');
				});
			}
		});
		$(document).on('click', '.download-torrent', function(e) {
			e.preventDefault();

			let currentButton = $(this);
			
			$.ajax('queueTorrent.php', {
				torrentLink: currentButton.closest('tr').find('torrent-link').attr('href'),
				success: () => {
					currentButton.closest('.media-card').addClass('queued');
				}
			});
		});
	}

	buildTable(array) {
		let html = `
		<thead>
			<tr>
				<th>Torrent</th>
				<th>Tags</th>
				<th>Download</th>
			</tr>
		</thead>
		<tbody>`;

		array.forEach((item) => {
			let chips;
			item.tags.forEach(tag => {
				chips += `<span class="chip">${tag}</span>`;
			});
			html += `<tr>\n<td><a class="torrent-link" href="${item.link}">${item.name}</a></td>\n<td>${chips}</td>\n<td><button class="download-torrent">Télécharger</button></td></tr>\n`;
		});

		html += '</tbody>';

		return html;
	}
}
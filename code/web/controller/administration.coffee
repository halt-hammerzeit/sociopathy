проверить_управляющего = (ввод, возврат) ->
	new Цепочка(возврат)
		.сделать ->	
			пользовательское.пользователь(ввод, @)
		.сделать (пользователь) ->
			if (пользователь.имя != 'Дождь со Снегом')
				return возврат('Вы не управляющий')
			возврат()

http.post '/приглашение/выдать', (ввод, вывод) ->
	return if пользовательское.требуется_вход(ввод, вывод)
	
	цепь(вывод)
		.сделать ->
			проверить_управляющего(ввод, @)
		.сделать ->
			#снасти.hash(new Date().getTime(), { random: true }, @)
			@(null, new Date().getTime().toString() + Math.random())
		.сделать (ключ) ->
			хранилище.collection('invites').save { ключ: ключ }, @
		.сделать (приглашение) ->
			вывод.send приглашение

http.post '/хранилище/изменить', (ввод, вывод) ->
	return if пользовательское.требуется_вход(ввод, вывод)
	
	человек = null
	цепь(вывод)
		.сделать ->
			проверить_управляющего(ввод, @)
	
		.сделать ->	
			хранилище.collection('people').findOne({}, @)
	
		.сделать (man) ->	
			человек = man
			@.done()
		
		.сделать ->
			вывод.send {}

http.post '/хранилище/создать_пользователей', (ввод, вывод) ->
	return if пользовательское.требуется_вход(ввод, вывод)
	цепь(вывод)
		.сделать ->
			проверить_управляющего(ввод, @)
		.сделать ->
			люди = []
			
			люди.push
				имя: 'Василий Иванович'
				'адресное имя': 'Василий Иванович'
				описание: 'слесарь'
				пол: 'мужской'
				откуда: 'Кемерово'
				пароль: '123'
				почта: '01@ivanov.com'
				'когда пришёл': new Date()
				'время рождения': '22.01.1955'
				характер: 'спокойный'
				убеждения: 'утопист'
				'семейное положение': 'заядлый бабник'
							
			люди.push
				имя: 'Анна Каренина'
				'адресное имя': 'Анна Каренина'
				описание: 'домохозяйка'
				пол: 'женский'
				откуда: 'Российская Империя'
				пароль: '123'
				почта: '011@ivanov.com'
				'когда пришёл': new Date()
				'время рождения': '21.04.1855'
				характер: 'любвеобильный'
				убеждения: 'романтика'
				'семейное положение': 'неразделённая любовь'
				
			люди.push
				имя: 'Джонни Депп'
				'адресное имя': 'Джонни Депп'
				описание: 'пират'
				пол: 'мужской'
				откуда: 'Штаты'
				пароль: '123'
				почта: '02@ivanov.com'
				'когда пришёл': new Date()
				'время рождения': '11.06.1970'
				характер: 'любитель острых ощущений'
				убеждения: 'монархические'
				'семейное положение': 'есть подруга'
				
			люди.push
				имя: 'Владимир Владимирович Путин'
				'адресное имя': 'Владимир Владимирович Путин'
				описание: 'президент'
				пол: 'мужской'
				откуда: 'Горки'
				пароль: '123'
				почта: '03@ivanov.com'
				'когда пришёл': new Date()
				'время рождения': '16.01.1960'
				характер: 'волевой'
				убеждения: 'авторитаризм'
				'семейное положение': 'женат'
				
			люди.push
				имя: 'Дедушка Мороз'
				'адресное имя': 'Дедушка Мороз'
				описание: 'красный нос'
				пол: 'мужской'
				откуда: 'Великий Устюг'
				пароль: '123'
				почта: '04@ivanov.com'
				'когда пришёл': new Date()
				'время рождения': '13.02.1933'
				характер: 'оптимист'
				убеждения: 'самодержавничество'
				'семейное положение': 'гей'
				
			люди.push
				имя: 'Petya Palkin'
				'адресное имя': 'Petya Palkin'
				описание: 'раздолбай'
				пол: 'мужской'
				откуда: 'От верблюда'
				пароль: '123'
				почта: '05@ivanov.com'
				'когда пришёл': new Date()
				'время рождения': '15.06.1988'
				характер: 'маниакально-депрессивный'
				убеждения: 'анархист'
				'семейное положение': 'в поиске пары'
			
			for i in [1..18]
				человек = 
					имя: 'Иванов Иван ' + i
					'адресное имя': 'Иванов Иван ' + i
					описание: 'заведующий'
					пол: 'мужской'
					откуда: 'Москва'
					пароль: '123'
					почта: 'ivan' + i + '@ivanov.com'
					'когда пришёл': new Date()
					'время рождения': '12.09.1990'
					вера: 'христианин'
					убеждения: 'социалист' 
					'семейное положение': 'разведён'
					
				люди.unshift человек
			@ null, люди
		
		.все_вместе (человек) ->
			хранилище.collection('people').save человек, @
			
		.сделать ->	
			хранилище.collection('people').find({}).toArray @

		.все_вместе (пользователь) ->	
			хранилище.collection('people_private_keys').save { пользователь: пользователь._id, 'тайный ключ': пользователь._id + new Date().getTime() }, @
			
		.сделать ->
			хранилище.collection('people').выбрать { с: 1, сколько: 2 }, @

		.делать (два_человека) ->
			хранилище.collection('chat').save { отправитель: два_человека[0]._id, сообщение: 'Ицхак (Ицик) Виттенберг родился в Вильно в 1907 году в семье рабочего. Был членом подпольной коммунистической партии в Литве, после присоединения Литвы к СССР руководил профсоюзом. После оккупации Литвы немецкими войсками перешёл на нелегальное положение.', время: new Date() }, @
				
		.делать (два_человека) ->
			хранилище.collection('chat').save { отправитель: два_человека[0]._id, сообщение: 'Dickinsonia (рус. дикинсония) — одно из наиболее характерных ископаемых животных эдиакарской (вендской) биоты. Как правило, представляет собой двусторонне-симметричное рифлёное овальное тело. Родственные связи организма в настоящее время неизвестны. Большинство исследователей относят дикинсоний к животным, однако существуют мнения, что они являются грибами или относятся к особому не существующему ныне царству живой природы.', время: new Date() }, @
				
		.делать (два_человека) ->
			хранилище.collection('chat').save { отправитель: два_человека[1]._id, сообщение: 'Овинище — Весьегонск — тупиковая однопутная 42-километровая железнодорожная линия, относящаяся к Октябрьской железной дороге, проходящая по территории Весьегонского района Тверской области (Россия) от путевого поста Овинище II, расположенного на железнодорожной линии Москва — Сонково — Мга — Санкт-Петербург (которая на разных участках называется Савёловским радиусом и Мологским ходом), до тупиковой станции Весьегонск и обеспечивающая связь расположенного на северо-восточной окраине Тверской области города Весьегонска с железнодорожной сетью страны.', время: new Date() }, @

		.сделать ->
			хранилище.collection('people').find({ имя: { $in: {'Василий Иванович', 'Анна Каренина'}} }).toArray @

		.сделать (два_человека) ->
			сообщения = []
			строки =
			[
				"Меж тем Онегина явленье "
				"У Лариных произвело "
				"На всех большое впечатленье "
				"И всех соседей развлекло. "
				"Пошла догадка за догадкой. "
				"Все стали толковать украдкой, "
				"Шутить, судить не без греха, "
				"Татьяне прочить жениха; "
				"Иные даже утверждали, "
				"Что свадьба слажена совсем, "
				"Но остановлена затем, "
				"Что модных колец не достали. "
				"O свадьбе Ленского давно "
				"У них уж было решено."
				"Татьяна слушала с досадой"
				"Такие сплетни; но тайком"
			]
			
			for i in [1..16]
				сообщение = 
					отправитель: два_человека[i % 2]._id
					сообщение: строки[i - 1]
					время: new Date()
					
				сообщения.push сообщение
			@ null, сообщения
		
		.все_вместе (сообщение) ->
			хранилище.collection('chat').save сообщение, @
			
http.post '/хранилище/заполнить', (ввод, вывод) ->
	return if пользовательское.требуется_вход(ввод, вывод)
	
	человек = null
	
	цепь(вывод)
		.сделать ->
			проверить_управляющего(ввод, @)
			
		# заполнить людей
						
		.сделать ->
			хранилище.collection('people').drop @
		
		.ошибка (ошибка) ->
			if ошибка.message == 'ns not found'
				return no
			console.error ошибка
			вывод.send ошибка: ошибка

		.сделать ->
			хранилище.collection('people').ensureIndex 'почта', true, @

		.сделать ->
			хранилище.collection('people').ensureIndex 'имя', true, @

		.сделать ->
			хранилище.collection('people').ensureIndex 'адресное имя', true, @

		.сделать ->
			человек =
				имя: 'Дождь со Снегом'
				'адресное имя': 'Дождь со Снегом'
				описание: 'главный архитектор'
				пол: 'мужской'
				откуда: 'Россия'
				пароль: 'change.this'
				почта: 'kuchumovn@gmail.com'
				'когда пришёл': new Date()
				'время рождения': '04.11.1987'
				характер: 'флегматичный'
				убеждения: 'социализм'
				'семейное положение': 'холост'
				ссылки: [ 'http://vkontakte.ru/kuchumovn', 'http://youtube.com/user/kuchumovn' ]
				
			хранилище.collection('people').save человек, @
			
		# заполнить тайные ключи людей
		
		.сделать ->
			хранилище.collection('people_private_keys').drop @
		
		.ошибка (ошибка) ->
			if ошибка.message == 'ns not found'
				return no
			console.error ошибка
			вывод.send ошибка: ошибка

		.сделать ->
			хранилище.collection('people_private_keys').ensureIndex 'пользователь', true, @

		.сделать ->
			хранилище.collection('people_private_keys').ensureIndex 'тайный ключ', true, @

		.сделать ->	
			хранилище.collection('people_private_keys').save { пользователь: человек._id, 'тайный ключ': человек._id + new Date().getTime() + Math.random() }, @
			
		# заполнить приглашения
			
		.сделать ->
			хранилище.collection('invites').drop @
		
		.ошибка (ошибка) ->
			if ошибка.message == 'ns not found'
				return no
			console.error ошибка
			вывод.send ошибка: ошибка
		
		.сделать ->
			хранилище.collection('invites').ensureIndex 'ключ', true, @
			
		# заполнить друзей
		
		.сделать ->
			хранилище.collection('friends').drop @
		
		.ошибка (ошибка) ->
			if ошибка.message == 'ns not found'
				return no
			console.error ошибка
			вывод.send ошибка: ошибка
				
		.сделать ->
			хранилище.createCollection 'friends', @
			
		.сделать ->
			хранилище.collection('friends').ensureIndex 'пользователь', yes, @

		# заполнить книги
		
		.сделать ->
			хранилище.collection('books').drop @
		
		.ошибка (ошибка) ->
			if ошибка.message == 'ns not found'
				return no
			console.error ошибка
			вывод.send ошибка: ошибка
				
		.сделать ->
			хранилище.createCollection 'books', @
			
		.сделать ->
			хранилище.collection('circles').ensureIndex('id', yes, @)
			
		.сделать ->
			хранилище.collection('circles').ensureIndex('сочинитель', no, @)
			
		.сделать ->
			хранилище.collection('circles').ensureIndex('название', no, @)
			
		.сделать ->
			книги = 
			[
				{
					сочинитель: 'Фритьоф Капра',
					название: 'Скрытые связи',
					id: 'Фритьоф Капра «Скрытые связи»',
					файл: 'книга.pdf',
					обложка: 'обложка.jpg'
				},
				{
					сочинитель: 'Edward Tufte',
					название: 'Visual Explanations',
					id: 'Edward Tufte «Visual Explanations»',
					ссылка: 'http://rutracker.org/forum/viewtopic.php?t=1488663',
					обложка: 'обложка.jpg'
				},
				{
					сочинитель: 'Кон И.С.',
					название: 'Мальчик — отец мужчины',
					id: 'Кон И.С. «Мальчик — отец мужчины»'
				},
				{
					сочинитель: 'Мэтью Макдональд',
					название: 'Научи свой мозг работать',
					id: 'Мэтью Макдональд «Научи свой мозг работать»'
				},
				{
					сочинитель: 'Шишков А.С.',
					название: 'Славяно-русский корнеслов'
					id: 'Шишков А.С. «Славяно-русский корнеслов»'
				},
				{
					сочинитель: 'Нюма-Дени Фюстель де Куланж',
					название: 'Гражданская община древнего мира',
					id: 'Нюма-Дени Фюстель де Куланж «Гражданская община древнего мира»'
				},
				{
					сочинитель: 'Барсенков А.С., Вдовин А.И.',
					название: 'История России. 1917-2004. Учебное пособие для вузов',
					id: 'Барсенков А.С., Вдовин А.И. «История России. 1917-2004. Учебное пособие для вузов»'
				},
				{
					сочинитель: 'Стивен Лаберж',
					название: 'Осознанное сновидение',
					id: 'Стивен Лаберж «Осознанное сновидение»'
				},
				{
					сочинитель: 'Ричард Броуди',
					название: 'Психические вирусы',
					id: 'Ричард Броуди «Психические вирусы»'
				},
				{
					сочинитель: 'Тим Харфорд',
					название: 'Экономист под прикрытием',
					id: 'Тим Харфорд «Экономист под прикрытием»'
				},
				{
					сочинитель: 'Артемий Лебедев',
					название: 'Ководство',
					id: 'Артемий Лебедев «Ководство»'
				},
				{
					сочинитель: 'Джон Гэлбрейт',
					название: 'Новое индустриальное общество',
					id: 'Джон Гэлбрейт «Новое индустриальное общество»'
				},
				{
					сочинитель: 'Станислав Гроф',
					название: 'Области человеческого безсознательного',
					id: 'Станислав Гроф «Области человеческого безсознательного»'
				},
				{
					сочинитель: 'Ян Зодерквист, Александр Бард',
					название: 'Netократия. Новая правящая элита и жизнь после капитализма',
					id: 'Ян Зодерквист, Александр Бард «Netократия. Новая правящая элита и жизнь после капитализма»'
				},
				{
					сочинитель: 'Ильин А.А.',
					название: 'Школа выживания. Как избежать голодной смерти',
					id: 'Ильин А.А. «Школа выживания. Как избежать голодной смерти»'
				},
				{
					сочинитель: 'Нассим Талеб',
					название: 'Чёрный лебедь',
					id: 'Нассим Талеб «Чёрный лебедь»'
				},
				{
					сочинитель: 'Юрий Дроздов',
					название: 'Записки начальника нелегальной разведки',
					id: 'Юрий Дроздов «Записки начальника нелегальной разведки»'
				},
				{
					сочинитель: 'Роберт Чалдини',
					название: 'Психология влияния',
					id: 'Роберт Чалдини «Психология влияния»'
				}
			]
					
			@.done(книги)
			
		.все_вместе (книга) ->
			хранилище.collection('books').save книга, @

		# заполнить круги пользователей
		
		.сделать ->
			хранилище.collection('circles').drop @
		
		.ошибка (ошибка) ->
			if ошибка.message == 'ns not found'
				return no
			console.error ошибка
			вывод.send ошибка: ошибка
				
		.сделать ->
			хранилище.createCollection 'circles', @
			
		.сделать ->
			хранилище.collection('circles').ensureIndex('пользователь', yes, @)
			
		.сделать ->
			хранилище.collection('circles').save({ пользователь: человек._id, круги: { 'Общий': [] } }, @)

		# заполнить книги пользователей
		
		.сделать ->
			хранилище.collection('peoples_books').drop @
		
		.ошибка (ошибка) ->
			if ошибка.message == 'ns not found'
				return no
			console.error ошибка
			вывод.send ошибка: ошибка
				
		.сделать ->
			хранилище.createCollection 'peoples_books', @
			
		.сделать ->
			хранилище.collection('peoples_books').ensureIndex('пользователь', yes, @)
			
		.сделать ->
			хранилище.collection('books').find({}).toArray @
			
		.сделать (книги) ->
			хранилище.collection('peoples_books').save({ пользователь: человек._id, книги: книги.map((книга) -> книга._id) }, @)

		# заполнить картинки
		
		.сделать ->
			хранилище.collection('pictures').drop @
		
		.ошибка (ошибка) ->
			if ошибка.message == 'ns not found'
				return no
			console.error ошибка
			вывод.send ошибка: ошибка
				
		.сделать ->
			хранилище.createCollection 'pictures', @
			
		.сделать ->
			хранилище.collection('pictures').ensureIndex([[ 'пользователь', 1 ], [ 'id', 1 ] ], yes, @)

		# картинки пользователя
		
		.сделать ->	
			альбомы = [
				{
					id: 'Реклама',
					название: 'Реклама / Раз / Два / Три',
					описание: 'Разного рода западные рекламные ролики',
					картинки: [
						{ имя: 'дети 1', описание: "Looking at the world through children's eyes.", формат: 'jpg' },
						{ имя: 'дети 2', описание: "Looking at the world through children's eyes.", формат: 'jpg' },
						{ имя: 'дети 3', описание: "Looking at the world through children's eyes.", формат: 'jpg' },
						{ имя: 'книги 1', описание: "Anagram bookshop", формат: 'jpg' },
						{ имя: 'книги 2', описание: "Anagram bookshop", формат: 'jpg' },
						{ имя: 'книги 3', описание: "Anagram bookshop", формат: 'jpg' }
					]
				},
				{
					название: 'Портрет',
					описание: 'Мои фотки',
					картинки: [
						{ имя: 'гермозона', формат: 'jpg' },
						{ имя: 'аниме', формат: 'jpg' }
					]
				}
			]
			
			@.done(альбомы)
			
		.все_вместе (данные_альбома) ->
			альбом = { пользователь: человек._id }
			альбом.id = данные_альбома.id
			альбом.картинки = данные_альбома.картинки
			
			хранилище.collection('pictures').save(альбом, @)
			
		# заполнить видео
		
		.сделать ->
			хранилище.collection('videos').drop @
		
		.ошибка (ошибка) ->
			if ошибка.message == 'ns not found'
				return no
			console.error ошибка
			вывод.send ошибка: ошибка
				
		.сделать ->
			хранилище.createCollection 'videos', @
			
		.сделать ->
			хранилище.collection('videos').ensureIndex([[ 'пользователь', 1 ], [ 'id', 1 ] ], yes, @)

		# видео пользователя
		
		.сделать ->	
			альбомы = [
				{
					id: 'Художества',
					название: 'Художества',
					описание: 'Художественные ролики',
					видео: [
						{ источник: 'vimeo.com', внешний_id: '37391578' },
						{ источник: 'vimeo.com', внешний_id: '31426899' }
					]
				},
				{
					id: 'Наркоман Павлик',
					название: 'Наркоман Павлик',
					описание: 'Приключения Павлика и его друга Дэнчика',
					видео: [
						{ источник: 'youtube.com', описание: "Павлик и Дэнчик везут вазу в Самару", внешний_id: 'R3g1fkAqolQ' },
						{ источник: 'youtube.com', описание: "Павлик и Дэнчик спалились", внешний_id: 'TT7UbfbeSjQ' }
					]
				}
			]
			
			@.done(альбомы)
			
		.все_вместе (данные_альбома) ->
			альбом = { пользователь: человек._id }
			альбом.id = данные_альбома.id
			альбом.видео = данные_альбома.видео
			
			хранилище.collection('videos').save(альбом, @)
			
		# заполнить дневники
			
		.сделать ->
			хранилище.collection('blogs').drop @
		
		.ошибка (ошибка) ->
			if ошибка.message == 'ns not found'
				return no
			console.error ошибка
			вывод.send ошибка: ошибка
				
		.сделать ->
			хранилище.createCollection 'blogs', @
			
		.сделать ->
			хранилище.collection('blogs').ensureIndex 'сочинитель', yes, @
			
		.сделать ->
			хранилище.collection('blogs').ensureIndex 'время', no, @

		.сделать ->
			хранилище.collection('blogs').save { сочинитель: человек._id, заглавие: 'Запись в дневнике', запись: 'АК-12 — российский автомат калибра 5,45 мм, перспективная разработка концерна «Ижмаш»[1]. Этот автомат разрабатывался, чтобы заменить в производстве и, возможно, на вооружении Вооружённых Сил Российской Федерации (ВС России) предыдущие варианты автоматов Калашникова — АК-74 и АК-74М, АК-103 и более ранние АКМ и АКМС.', время: new Date() }, @
			
		# заполнить разделы читальни
			
		.сделать ->
			хранилище.collection('library_categories').drop @
		
		.ошибка (ошибка) ->
			if ошибка.message == 'ns not found'
				return no
			console.error ошибка
			вывод.send ошибка: ошибка
				
		.сделать ->
			хранилище.createCollection 'library_categories', @
			
		.сделать ->
			хранилище.collection('library_categories').ensureIndex 'путь', yes, @
			
		.сделать ->
			хранилище.collection('library_categories').ensureIndex 'надраздел', no, @

		.сделать ->
			разделы = []
			for название in [ 'Физика', 'Строительство', 'Механизация', 'Словесность', 'Власть', 'Душеведение', 'Общество', 'Летопись' ]
				разделы.push
					название: название
					'путь': название
					
			@ null, разделы
			
		.все_вместе (раздел) ->
			хранилище.collection('library_categories').save раздел, @
				
		.сделать () ->
			хранилище.collection('library_categories').findOne { название: 'Физика' }, @
			
		.сделать (физика) ->
			электромагнетизм = 
				название: 'Электромагнетизм'
				'путь': 'Физика/Электромагнетизм'
				надраздел: физика._id
				style_classes: 'smaller'
			
			хранилище.collection('library_categories').save электромагнетизм, @

		.сделать ->
			хранилище.collection('library_article_drafts').drop @
					
		.ошибка (ошибка) ->
			if ошибка.message == 'ns not found'
				return no
			console.error ошибка
			вывод.send ошибка: ошибка
				
		.сделать ->
			хранилище.createCollection 'library_article_drafts', @

		.сделать ->
			хранилище.collection('library_article_drafts').ensureIndex '_id заметки', yes, @

		.сделать ->
			хранилище.collection('library_article_drafts').ensureIndex '_id человека', yes, @

		.сделать ->
			хранилище.collection('library_articles').drop @
					
		.ошибка (ошибка) ->
			if ошибка.message == 'ns not found'
				return no
			console.error ошибка
			вывод.send ошибка: ошибка
				
		.сделать ->
			хранилище.createCollection 'library_articles', @

		.сделать ->
			хранилище.collection('library_articles').ensureIndex 'путь', yes, @

		.сделать ->
			хранилище.collection('library_articles').ensureIndex 'раздел', no, @

		.сделать () ->
			хранилище.collection('library_categories').findOne { название: 'Физика' }, @
			
		.сделать (физика) ->
			заметка = "<p>Материальная точка — объект, не имеющий размеров, но обладающий всеми остальными свойствами (массой, зарядом и т.п.).</p>
		
				<p>Используется в физике в качестве упрощённой модели относительно малого объекта (относительно малого в рамках задачи). Например, при расчёте пути, пройденного поездом из Петрограда во Владивосток, можно пренебречь его очертаниями и размерами, поскольку они гораздо меньше протяжённости пути.</p>

				<div class='citation'><span class='text'>Война - это путь обмана. Поэтому, даже если [ты] способен, показывай противнику свою неспособность. Когда должен ввести в бой свои силы, притворись бездеятельным. Когда [цель] близко, показывай, будто она далеко; когда же она действительн далеко, создавай впечатление, что она близко</span><div class='author'>Cунь Цзы, «Искусство Войны»</div></div>
				
				<p>Вставим-как сюда картинку: <img src='http://cdn1.iconfinder.com/data/icons/49handdrawing/128x128/picture.png' type='picture'/>, вот так.</p>
				
				<p>Однако не всегда можно пользоваться материальными точками для решения задач. Например, при расчёте распределения энергии молекул в <a type='hyperlink' href='/читальня/химия/инертный газ'>инертном газе</a> можно представить молекулы материальными точками (шариками). Однако для других веществ начинает иметь значение строение молекулы, так как колебание и вращение самой молекулы начинают запасать в себе значительную энергию.</p>
				
				<h2>Ссылки</h2>
		
				<ul class='references'>
					<li><a href='http://ru.wikipedia.org/wiki/Материальная_точка'>WikiPedia</a></li>
					<li><a href='http://phys.msu.ru/'>ФизФак МГУ</a></li>
				</ul>"	
			
			заметка = заметка.replace_all('\n', '')
			заметка = заметка.replace_all('\t', '')
			
			материальная_точка = 
				название: 'Материальная точка'
				путь: 'Физика/Материальная точка'
				раздел: физика._id
				содержимое: заметка
			
			хранилище.collection('library_articles').save материальная_точка, @
			
		# заполнить болталку
			
		.сделать ->
			хранилище.collection('chat').drop @
		
		.ошибка (ошибка) ->
			if ошибка.message == 'ns not found'
				return no
			console.error ошибка
			вывод.send ошибка: ошибка
				
		.сделать ->
			# { capped: true, size: 100 }, 
			хранилище.createCollection 'chat', @
			
		.сделать ->
			хранилище.collection('chat').ensureIndex 'отправитель', no, @
					
		# готово
			
		.сделать ->
			вывод.send {}
хранилище = global.db
http = global.application_tools.http
цепь = require './../web_conveyor'

снасти = require './../tools'

###
страницы =
[
	'люди',
	'прописка',
	'сеть/настройки',
	'сеть/болталка',
	'сеть/обсуждения',
	'сеть/беседы',
	'сеть/почта',
	'обложка',
	'помощь',
	'помощь/режимы',
	'заметка',
	'читальня',
	'управление'
]

страницы.forEach (страница) ->
	http.get "/страница/#{страница}", (ввод, вывод) ->
		цепь(вывод)
			.сделать ->
				снасти.отдать_страницу страница, {}, ввод, вывод
###
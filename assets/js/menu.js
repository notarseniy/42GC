$(document).ready(function(){
	$('.menubutton').popup({
		 on: 'click',
		 html: '<div class="ui link list"><a class="item" href="//42gc.ru">Сокращалка</a><span class="item">Список GC сервисов</span><div class="ui fitted divider"></div><a class="item" href="//kern0.co">Блог</a><a class="item" href="http://kern0.co/42gc-rules">Правила</a><a class="item" href="/about">О Проекте</a></div>',
		 position: 'top left',
		 variation: 'inverted'
	  });
});
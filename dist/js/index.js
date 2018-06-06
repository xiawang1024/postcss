$(function() {
	console.log($('.g-tab .m-tab .item'));
	$('.g-tab .m-tab .item').click(function() {
		$(this).addClass('active').siblings().removeClass('active');
		var index = $(this).index();
		$('.g-bd .m-tab-wrap').eq(index).css('display', 'block').siblings('.m-tab-wrap').css('display', 'none');
	});

	var page = 2;

	$('.g-bd .products-list .u-see-more').click(function() {
		var loading = weui.loading('加载中...');
		$.ajax({
			url: 'http://api.hndt.com/api/page?template_id=346&page=' + page,
			dataType: 'json',
			success: function(data) {
				if (data.list) {
					var result = toHtml(data.list);
					$('.products-list .list-wrap').append(result);
					page++;
					loading.hide();
				} else {
					loading.hide();
					weui.alert('没有更多数据！');
				}
			}
		});
	});

	function toHtml(list) {
		var html = '';
		for (var i = 0; i < list.length; i++) {
			var item = list[i];
			html +=
				'<li class="list">' +
				'    <a href="' +
				item.link +
				'">' +
				'        <div class="img-wrap">' +
				'            <img src="' +
				item.src +
				'" alt="" class="img">' +
				'        </div>' +
				'        <div class="text-wrap">' +
				'            <h3 class="title">' +
				item.title +
				'</h3>' +
				'            <p class="name">' +
				item.author +
				'</p>' +
				'        </div>' +
				'    </a>' +
				'</li>';
		}
		return html;
	}
});

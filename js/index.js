$(function() {
	console.log($('.g-tab .m-tab .item'));
	$('.g-tab .m-tab .item').click(function() {
		$(this).addClass('active').siblings().removeClass('active');
		var index = $(this).index();
		$('.g-bd .m-tab-wrap').eq(index).css('display', 'block').siblings('.m-tab-wrap').css('display', 'none');
	});
});

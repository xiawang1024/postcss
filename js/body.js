(function() {
	//播放
	var audio = document.getElementById('audio');
	var playBtn = document.getElementById('playOrPause');
	$(playBtn).click(function() {
		var isPlay = $(this).hasClass('active');
		if (!isPlay) {
			$(this).addClass('active');
			play();
		} else {
			$(this).removeClass('active');
			pause();
		}
	});
	function play() {
		audio.play();
	}
	function pause() {
		audio.pause();
	}

	//评论
	$('#sendMsg').click(function() {
		var comment = $('#comment').val();
		if (!comment) {
			toast('内容不能为空');
		} else {
			toast(comment);
		}
	});

	//点赞
	$('.g-bd .m-comment .comment-list .list .zan').click(function() {
		toast('点赞成功！');
	});
	//查看更多
	$('.g-bd .m-comment .comment-list .u-see-more').click(function() {
		toast('查看更多');
	});

	var getSingle = function(fn) {
		var result;
		return function() {
			result || (result = fn.apply(this, arguments));
		};
	};
	var createMsg = function() {
		var node = $('<div id="toast"></div>');
		node.css('display', 'none');
		$('body').append(node);
		return node;
	};
	var createSingleMsg = getSingle(createMsg);
	function toast(msg) {
		var node = createSingleMsg(msg);
		$('#toast').html(msg);
		$('#toast').css('display', 'block');
		clearTimeout(timeId);
		var timeId = setTimeout(function() {
			$('#toast').css('display', 'none');
		}, 2000);
	}
})();

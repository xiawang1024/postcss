//fastClick 消除click 300ms延迟
if ('addEventListener' in document) {
	document.addEventListener(
		'DOMContentLoaded',
		function() {
			FastClick.attach(document.body);
		},
		false
	);
}

console.log('gulp工作流');

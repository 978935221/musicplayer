$(function(){
	// 声明服务端根地址
	let baseUrl = 'http://music.softeem.top/';
	// 声明数组用于存储所有获取到的歌曲信息
	let musics = [];
	//声明变量表示当前正在播放的歌曲索引
	let current = 0;
	// //创建一个audio元素（<audio>标签）
	// let player = document.createElement('audio');
	let player = $('<audio>');
	//声明歌曲播放的状态标记 用于标记是否在播放（默认为播放）
	let isPlaying = false;
	//声明临时变量表示歌曲当前播放时长和总时长（秒）
	let now = 0;
	let total = 0;
	
	
	let num = 0;
	let flag = 0;
	//使用到ajax技术请求服务端数据(XmlHttpRequest)
	//Restful get post put delete
	//js是一门弱类型语言，定义变量时无需指定数据类型(javascript网络编程)
	$.getJSON(baseUrl+'list',function(date){
		musics = date;
		//对数据渲染
		render(musics);
		
	})
	
	//获取到的音乐数据在页面进行渲染
	function render(musics){
		let html = '';
		
		//对数组进行遍历
		$.each(musics,function(i,m){
			let name = m.name;
			let size = m.size;
			//大小格式化
			size = fmtSize(size);
			html += `<div class="item" data-index="${i}">
						<div class="item-name">${name}</div>
						<div class="item-size">${size}</div>
					</div>`
		})
		//将生成的html代码插入到列表区域（class = "body"）
		//document.querySelector('.body')
		//document.getElementById(id)
		$('.body_item').html(html);
	}
	
	//对歌曲的大小格式化，将字节转化为mb
	function fmtSize(size){
		size = size/(1024*1024);
		//只截取小数点后一位
		size = size.toFixed(1);
		return size + 'MB';
	}
	
	//为歌曲列表绑定事件监听(事件委托机制)  item--委托-->body
	$('.body').on('click','.item',function(){
		//将上一首在播放的歌曲状态还原
		$(this).parent().find('.item:eq('+current+')').removeClass('isPlaying');
		//获取需要播放的歌曲索引
		current = $(this).data('index');
		//获取需要被播放的歌曲对象
		let m = musics[current];
		//为播放器设置一个src属性（播放器）
		player.prop('src', baseUrl + m.path);
		// //为当前被选中的歌曲列表项增加类（设置背景高亮）
		// $(this).addClass('isPlaying');
		//标记当前歌曲处于播放状态
		isPlaying = true;
		
		//开始播放
		startPlay();
	})
	
	//播放器开始播放
	function startPlay(){
		// console.log(player);
		// 将jQuery对象转换为js对象,并调用play实现歌曲播放
		player[0].play();
		//将图标切换为暂停图标
		$('.music-btn').css('background-image','url(./img/暂停.png)');
		//当前歌曲名到底部控制区
		$('.music-name').text(musics[current].name);
		//设置当前正在播放歌曲的背景高亮
		$('.body').find(`.item:eq(${current})`).addClass('isPlaying');
	}
	
	$('.music-btn').on('click',function(){
		//判断歌曲是否在放
		if(isPlaying){
			//暂停
			player[0].pause();
			//将图标切换为暂停图标
			$('.music-btn').css('background-image','url(./img/播放.png)');
		}else{
			//播放
			startPlay();
		}
		isPlaying = !isPlaying;
	})
	//监听当播放器要播放的音乐第一帧加载之后触发(播放器准备开始播放时)
	player.on('loadeddata',function(){
		//获取当前播放音乐文件的总时长(秒)
		total = this.duration;//duration 持续时长
		console.log(total);
		// 显示总时长到界面
		$('.time-total').text(fmtTime(total));
		
	})
	//当播放器的currentTime属性值发生变化时执行
	player.on('timeupdate',function(){
		//获取当前的播放时间
		now = this.currentTime;
		// 计算获取进度条的宽度
		let progress = now / total * 100 + '%';
		// 设置进度条宽度
		$('.progress-bar').css('width',progress);
		//显示当前进度
		$('.time-now').text(fmtTime(now));
	})
	//将以秒为单位的时长格式化为 mm：ss
	function fmtTime(time){
		//将秒转换为毫秒 1s=1000ms
		time = time *1000
		//根据毫秒数构建日期对象
		let date = new Date(time);
		//获取分钟
		let m = date.getMinutes();
		m = m < 10 ? '0' + m :m;
		//获取分钟
		let s = date.getSeconds();
		s = s < 10 ? '0' + s : s;
		return m + ':' + s;
	}
	//当歌曲播放完成之后执行以下函数
	player.on('ended',function(){
		//将上一首播放完成的歌曲背景高亮去除
		$('.body').find(`.item:eq(${current})`).removeClass('isPlaying');
		
		//切换下一首歌曲（默认列表循环）
		if(flag == 0){
			current = ++current % musics.length;
		}else if(flag == 1){
			current = (int)(Math.random()*21);
		}
		
		//重新设置播放源
		player.prop('src',baseUrl+musics[current].path);
		startPlay();
	})
	
	//鼠标碰到循环播放时发生动画
	
	
	// $('.body_window').on('mouseout',function(){
	// 	$('.body_random').slideUp(1000);
	// });
	$('.body_window').on('mousemove',function(){
		$('.body_random').slideDown(1000);
		
	});
	$('.body_window').on('click',function(){
		flag = 0;
	});
	
	$('.body_random').on('click',function(){
		flag = 1;
	});
	
})
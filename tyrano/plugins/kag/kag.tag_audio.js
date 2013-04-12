

/*
#[playbgm]
:group
Audio
:title
Play BGM
:exp
Play BGM
mp3 or ogg.  HTML5 standard support.
Playback files should be stored in the project's bgm folder.

:sample
[playbgm storage="music.mp3"]
:param
storage=Set the file to be used,
loop=set as true (default) or false. true will repeat the loop,
click=スマートフォンのブラウザから閲覧した場合のみ動作（アプリの場合不要）true またはfalse（デフォルト）を指定してください。trueの場合、スマートフォン（ブラウザ）から閲覧した場合、再生前にクリックが必要になります。
これは、スマートフォンの仕様上、クリックしないと音が鳴らせない縛りがあるため、例えば、背景変更後に音楽再生をしたい場合はtrueを指定しないと音はなりません。通常のテキストの中で音楽再生の場合はfalseで大丈夫です。スマートフォンから閲覧して音楽が鳴らない場合はtrueにしてみてください
#[end]
*/


//音楽再生
tyrano.plugin.kag.tag.playbgm = {
    
    vital:["storage"],
    
    pm:{
        loop:"true",
        storage:"",
        fadein:"false",
        time:2000,
        target:"bgm", //"bgm" or "se"
        click:"false", //音楽再生にクリックが必要か否か
        stop:"false"  //trueの場合自動的に次の命令へ移動しない。ロード対策
        
    },
    
    start:function(pm){
        
        var that = this;
        
        
        if(pm.target=="bgm" && that.kag.stat.play_bgm == false){
            that.kag.ftag.nextOrder();
            return ;
        }
        
        if(pm.target=="se" && that.kag.stat.play_se == false){
            that.kag.ftag.nextOrder();
            return ;
        }
        
        
        //スマホアプリの場合
        if(that.kag.define.FLAG_APRI == true){
        
            that.playGap(pm);
        
        //スマホからのアクセスの場合は、クリックを挟む
        }else if($.userenv() !="pc"){
            
            this.kag.layer.hideEventLayer();
            //スマホからの場合、スキップ中は音楽をならさない
            if(this.kag.stat.is_skip == true && pm.target=="se"){
               that.kag.layer.showEventLayer();
               that.kag.ftag.nextOrder();
               
           }else{
               
               if(pm.click == "true"){
                    
                    $(".tyrano_base").bind("click.bgm",function(){
                    
                        that.play(pm);
                        $(".tyrano_base").unbind("click.bgm");
                        that.kag.layer.showEventLayer();
                     
                    });
                
               }else{
                    
                     that.play(pm);
                     $(".tyrano_base").unbind("click.bgm");
                     that.kag.layer.showEventLayer();
                     
               }
                
            }
            
        }else{
            
            var browser = $.getBrowser();
            
            if(browser == "firefox" || browser =="opera" || (browser =="safari" && $.userenv()=="pc" ) ){
                
                that.playSwf(pm);
                
            }else{
            
                that.play(pm);
                
            }
        }
         
    },
    
    play:function(pm){
        
        var that = this;
        
        var target = "bgm";
        
        if(pm.target =="se"){
            target = "sound";
        }
        
        //音楽再生
        var audio_obj = new Audio("./data/"+target+"/" + pm.storage);
        if(pm.loop =="true"){
            audio_obj.loop = true;
           
           audio_obj.onended=function(){
                    this.play();
           }; 
        }
        
        if(target ==="bgm"){
            this.kag.tmp.map_bgm[pm.storage] = audio_obj;
            that.kag.stat.current_bgm = pm.storage;
            
        }else{
            this.kag.tmp.map_se[pm.storage] = audio_obj;
        }
        
        audio_obj.play();
        
        if(pm.fadein =="true"){
            
            var vars = jQuery.extend($('<div>')[0], { volume: 0 });
            
            $(vars).stop().animate({ volume: 1 }, {
                easing: "linear",
                duration: parseInt(pm.time),
                step: function() {
                    audio_obj.volume = this.volume; // this == vars
                },
                complete:function(){
                    //alert("complete fade");
                    //that.kag.ftag.completeTrans();   
                }
            });
        
        }
        
        if(pm.stop == "false"){
        
            this.kag.ftag.nextOrder();
        }
    },
    
    //phonegapで再生する
    playGap:function(pm){
        
        var that = this;
        
        var target = "bgm";
        if(pm.target =="se"){
            target = "sound";
        }
        
        var audio_obj = null;
        
        if(target ==="bgm"){
            this.kag.stat.current_bgm = pm.storage;
        }
        
        var audio_obj = new Media($.getBaseURL()+"data/"+target+"/"+ pm.storage,

           function(){
                        
                                  
                        if(pm.loop == "true"){
                            
                                  var tmp_obj = null;
                                  
                                  if(pm.target =="bgm"){
                                    tmp_obj = that.kag.tmp.map_bgm[pm.storage] ;
                                  }else{
                                    tmp_obj = that.kag.tmp.map_se[pm.storage];
                                  }
                                  
                                  if(tmp_obj != null){
                                    audio_obj.play();
                                  }
                        
                        }
                        
             });

        
        if(pm.target =="bgm"){
            this.kag.tmp.map_bgm[pm.storage] = audio_obj;
        }else{
            this.kag.tmp.map_se[pm.storage] = audio_obj;
        }
        
        //audio_obj.play();     
        //setTimeout(function(){audio_obj.play();},300);
		
		this.playAudio(audio_obj);

		
        if(pm.stop == "false"){
        
            this.kag.ftag.nextOrder();
        
        }
        
        
    },
    
    playAudio:function(audio_obj){
    	audio_obj.play();
    },
    
    //フラッシュで再生する
    playSwf:function(pm){
        
        var target = "bgm";
        
        if(pm.target =="se"){
            target = "sound";
        }
        
        
        var repeat = 1;
        
        if(pm.loop =="true"){
            repeat = 9999;
        }
        
        
        var target = "bgm";
        if(pm.target =="se"){
            target = "sound";
        }
        if(target ==="bgm"){
            this.kag.stat.current_bgm = pm.storage;
            this.kag.sound_swf.playMusic("./data/"+target+"/" + pm.storage ,repeat);
        
        }else{
        
            this.kag.sound_swf.playSound("./data/"+target+"/" + pm.storage ,repeat);
            
        }
        
        
        if(pm.stop == "false"){
        
            this.kag.ftag.nextOrder();
        
        }
        
        
    }
    
};


/*
#[stopbgm]
:group
Audio
:title
Stop BGM
:exp
Stop BGM
:sample
[stopbgm ]
:param
#[end]
*/


tyrano.plugin.kag.tag.stopbgm = {

    pm:{
        fadeout:"false",
        time:2000,
        target:"bgm",
        stop:"false"  //trueの場合自動的に次の命令へ移動しない。ロード対策
        
    },

    start:function(pm){
        
        var that = this;
        
        var target_map =null;
        
        if(pm.target =="bgm"){
            target_map = this.kag.tmp.map_bgm;
        }else{
            target_map = this.kag.tmp.map_se;
        }
        
        var browser = $.getBrowser();
        
        //アプリで再生している場合
        if(that.kag.define.FLAG_APRI == true){
            //
             for(key in target_map ){
                    
                    (function(){
                        
                        var _key = key;
                        var _audio_obj = null;
                        
                        if(pm.target ==="bgm"){
                            _audio_obj = target_map[_key];
                             
                             //ロード画面の場合、再生中の音楽はそのまま、直後にロードするから
                              if(pm.stop == "false"){
                                that.kag.stat.current_bgm = "";
                              }
                              
                        }else{
                            _audio_obj = target_map[_key];
                        }
                        
                        _audio_obj.stop();
                        _audio_obj.release();
                        
                        if(pm.target ==="bgm"){
                            that.kag.tmp.map_bgm[_key] = null;
                            delete that.kag.tmp.map_bgm[_key] ;
                         }else{
                            that.kag.tmp.map_se[_key] = null;
                            delete that.kag.tmp.map_se[_key] ;
                         }
                    
                    })();
                    
            }
            
        //フラッシュで再生している場合
        }else if(browser == "firefox" || browser =="opera" || (browser =="safari" && $.userenv()=="pc" )){
            
            
            this.kag.sound_swf.stopMusic();
            
            //ロード画面の場合、再生中の音楽はそのまま、直後にロードするから
            
            var target = "bgm";
            if(pm.target =="se"){
                target = "sound";
            }
            if(target ==="bgm"){
                 //ロード画面の場合、再生中の音楽はそのまま、直後にロードするから
                 if(pm.stop == "false"){
                    that.kag.stat.current_bgm = "";
                 }
            }
        
            
        }else{
        
            
            for(key in target_map ){
                    
                    (function(){
                        
                        var _key = key;
                        
                        var _audio_obj = null;
                        
                        if(pm.target ==="bgm"){
                            _audio_obj = target_map[_key];
                             
                             //ロード画面の場合、再生中の音楽はそのまま、直後にロードするから
                              if(pm.stop == "false"){
                                that.kag.stat.current_bgm = "";
                              }
                              
                        }else{
                            _audio_obj = target_map[_key];
                        }
                        
                        //フェードアウトしながら再生停止
                        if(pm.fadeout =="true"){
                            
                            var vars = jQuery.extend($('<div>')[0], { volume: 1 });
                            
                            $(vars).stop().animate({ volume: 0 }, {
                                easing: "linear",
                                duration: parseInt(pm.time),
                                step: function() {
                                    _audio_obj.volume = this.volume; // this == vars
                                },
                                complete: function() {
                                    _audio_obj.pause();
                                    //that.kag.ftag.completeTrans();
                                }
                            });
                        
                        }else{
                            
                            _audio_obj.pause();
                            
                            if(pm.target ==="bgm"){
                                delete that.kag.tmp.map_bgm[_key] ;
                                
                            }else{
                                delete that.kag.tmp.map_se[_key] ;
                                
                            }
                        
                        }
                    
                    })();
                    
            }
        }
        
        if(pm.stop == "false"){
            this.kag.ftag.nextOrder();
        }
    }
    

};

/*
#[fadeinbgm]
:group
Audio
:title
Fade In BGM
:exp
Gradually fade in BGM
一部環境（Firefox、Sarafi等）においては対応していません。その場合、playbgmの動作となります。
:sample
[fadeinbgm storage=sample.mp3 loop=false time=3000]
:param
storage=再生する音楽ファイルを指定してください,
loop=true（デフォルト）またはfalse を指定してください。trueを指定すると繰り返し再生されます,
click=スマートフォンのブラウザから閲覧した場合のみ動作（アプリの場合不要）true またはfalse（デフォルト）を指定してください。trueの場合、スマートフォン（ブラウザ）から閲覧した場合、再生前にクリックが必要になります。
これは、スマートフォンの仕様上、クリックしないと音が鳴らせない縛りがあるため、例えば、背景変更後に音楽再生をしたい場合はtrueを指定しないと音はなりません。通常のテキストの中で音楽再生の場合はfalseで大丈夫です。スマートフォンから閲覧して音楽が鳴らない場合はtrueにしてみてください,
time=フェードインを行なっている時間をミリ秒で指定します。
#[end]
*/

tyrano.plugin.kag.tag.fadeinbgm = {
    
    vital:["storage","time"],
    
    pm:{
        loop:"true",
        storage:"",
        fadein:"true",
        time:2000
    },
    
    start:function(pm){
        this.kag.ftag.startTag("playbgm",pm);
    }
    
};



/*
#[fadeoutbgm]
:group
Audio
:title
Fade Out BGM
:exp
Fade Out BGM
一部環境（Firefox、Sarafi等）においては対応していません。その場合、playbgmの動作となります。
:sample
[fadeoutbgm  time=3000]
:param
time=Time in miliseconds for fade out to occur
#[end]
*/
tyrano.plugin.kag.tag.fadeoutbgm = {
    
    //vital:["time"],
    
    pm:{
        loop:"true",
        storage:"",
        fadeout:"true",
        time:2000
    },
    
    start:function(pm){
        this.kag.ftag.startTag("stopbgm",pm);
    }
    
};


/*
#[xchgbgm]
:group
Audio
:title
Crossfade BGM
:exp
Crossfade BGM
音楽が交差して切り替わる演出に使用できます。
一部環境（Firefox、Safari等）において対応していません。その場合、playbgmの動作となります。
:sample
[xchgbgm storage=new.mp3 loop=true time=3000]
:param
storage=次に再生するファイルを指定してください,
loop=true（デフォルト）またはfalse を指定してください。trueを指定すると繰り返し再生されます,
click=スマートフォンのブラウザから閲覧した場合のみ動作（アプリの場合不要）true またはfalse（デフォルト）を指定してください。trueの場合、スマートフォン（ブラウザ）から閲覧した場合、再生前にクリックが必要になります。
これは、スマートフォンの仕様上、クリックしないと音が鳴らせない縛りがあるため、例えば、背景変更後に音楽再生をしたい場合はtrueを指定しないと音はなりません。通常のテキストの中で音楽再生の場合はfalseで大丈夫です。スマートフォンから閲覧して音楽が鳴らない場合はtrueにしてみてください,
time=クロスフェードを行なっている時間をミリ秒で指定します。
#[end]
*/

tyrano.plugin.kag.tag.xchgbgm = {
    
    vital:["storage","time"],
    
    pm:{
        loop:"true",
        storage:"",
        fadein:"true",
        fadeout:"true",
        time:2000
    },
    
    start:function(pm){
        
        this.kag.ftag.startTag("stopbgm",pm);
        this.kag.ftag.startTag("playbgm",pm);
        
    }
    
};



/*
#[playse]
:group
Audio
:title
Play a sound effect
:exp
Play a sound effect
効果音ファイルはプロジェクトフォルダのsoundフォルダに入れてください
:sample
[playse storage=sound.mp3 loop=false ]
:param
storage=再生するファイルを指定してください,
loop=trueまたはfalse （デフォルト）を指定してください。trueを指定すると繰り返し再生されます,
clear=trueまたはfalse(デフォルト) 他のSEが鳴っている場合、trueだと他のSEを停止した後、再生します。音声などはtrueが便利でしょう
#[end]
*/

tyrano.plugin.kag.tag.playse = {
    
    vital:["storage"],
    
    pm:{
        storage:"",
        target:"se",
        loop:"false",
        clear:"false" //他のSEがなっている場合、それをキャンセルして、新しく再生します
    },
    
    start:function(pm){
        
        if(pm.clear == "true"){
            this.kag.ftag.startTag("stopbgm",{target:"se",stop:"true"});
        }
        
        this.kag.ftag.startTag("playbgm",pm);
        
    }
    
};

/*
#[stopse]
:group
Audio
:title
Stop a sound effect
:exp
Stop a sound effect
:sample
[stopse ]
:param
#[end]
*/

tyrano.plugin.kag.tag.stopse = {
    
    pm:{
        storage:"",
        fadeout:"false",
        time:2000,
        target:"se"
    },
    
    start:function(pm){
        this.kag.ftag.startTag("stopbgm",pm);
    }
    
};

/*
#[fadeinse]
:group
Audio
:title
Fade in a sound effect
:exp
Fade in a sound effect
:sample
[fadeinse storage=sound.mp3 loop=false time=2000 ]
:param
storage=Set playback file
loop=set as true or false(default). true will repeat the playback,
time=set the fade in time in miliseconds
#[end]
*/

tyrano.plugin.kag.tag.fadeinse = {
    
    vital:["storage","time"],
    
    pm:{
        storage:"",
        target:"se",
        loop:"false",
        fadein:"true",
        time:"2000"
        
    },
    
    start:function(pm){
        
        this.kag.ftag.startTag("playbgm",pm);
        
    }
    
};

/*
#[fadeoutse]
:group
Audio
:title
Sound Effect fadeout
:exp
Sound Effect fadeout
:sample
[fadeoutse time=2000 ]
:param
time=fadeout in miliseconds
#[end]
*/

tyrano.plugin.kag.tag.fadeoutse = {
    
    pm:{
        storage:"",
        target:"se",
        loop:"false",
        fadeout:"true"
    },
    
    start:function(pm){
        
        this.kag.ftag.startTag("stopbgm",pm);
        
    }
    
};

/*
#[wb]
:group
Audio
:title
Pause BGM Playback
:exp
Pause BGM Playback
:sample
:param
#[end]
*/

//BGMのフェード完了を待ちます
tyrano.plugin.kag.tag.wb = {
    
    pm:{
    },
    start:function(){
        this.kag.layer.hideEventLayer();
        
    }
};


//未実装　seの再生終了を待ちます 
tyrano.plugin.kag.tag.wc = {
    
    pm:{
    },
    start:function(){
       this.kag.layer.hideEventLayer();
    }
};





/*
[fadeinbgm storage="e:3" time=5000]
再生中・・・停止するにはクリックしてください。[l]
[fadeoutbgm time=5000]
*/




window.onload = function () {

    var game, config, socket;

    var _gW = 0, _gH = 0, _scale = 1;

    var username = document.getElementById('username');

    username.value = 'Player' + Math.floor( Math.random() * 99999 );

    var btn = document.getElementById ('btnEnter');    

    var form = document.getElementById ('myForm');

    form.onsubmit = function ( e ) {

        e.preventDefault();

        document.getElementById('game_login').style.display = 'none';
        document.getElementById('game_div').style.display = 'block';
        
        enterGame ();
        
    }

    readDeviceOrientation();

    this.addEventListener("orientationchange", function() {
        readDeviceOrientation()
    });

    function readDeviceOrientation () {


        if ( window.orientation == undefined  ) return;

        var landscape = Math.abs ( window.orientation) == 0;

        var btn_enter =  document.getElementById('btnEnter');

        btn_enter.disabled = ( landscape ) ? true : false; 

        var message_div =  document.getElementById('messageDiv');

        message_div.innerHTML = ( !landscape ) ? '' : '<small>Please set device orientation to landscape.</small>';

    }

    function enterGame () {

        var maxW = 1280;

        var container = document.getElementById('game_container');

        var contW = container.clientWidth,
            contH = container.clientHeight;

        var tmpWidth = contW > maxW ? maxW : contW,
            tmpHeight = Math.ceil(tmpWidth * 9/16);

        if ( tmpHeight >= contH ) {

            _gh = contH;
            _gW = Math.ceil(_gH * 16/9);
            //console.log ( 'game dimensions adjusted by screen height' )

        }else {

            _gW = tmpWidth;
            _gH= tmpHeight;
            //console.log ( 'game dimensions adjusted by screen width' )
        }

        
        _scale = _gW/maxW;

        var game_div = document.getElementById('game_div');
            game_div.style.width = _gW + 'px';
            game_div.style.height = _gH + 'px';
     

        config = {

            type: Phaser.AUTO,
            width: _gW,
            height: _gH,
            backgroundColor: '#dedede',
            audio: {
                disableWebAudio: false
            },
            parent:'game_div',
            scene: [ SceneA, SceneB ]

        };

        game = new Phaser.Game(config);

        //socket = io();
        
        //socket.emit ('initUser', username.value );

    }

    var SceneA = new Phaser.Class({

        Extends: Phaser.Scene,
    
        initialize:
    
        function SceneA ()
        {
            Phaser.Scene.call(this, { key: 'sceneA' });
        },
        preload: function ()
        {

          
            this.load.audioSprite('sfx', 'client/assets/sfx/fx_mixdown.json', [
                'client/assets/sfx/sfx.ogg',
                'client/assets/sfx/sfx.mp3'
            ]);
            
            this.load.audio ('bgsound2', ['client/assets/sfx/bgsound.ogg', 'client/assets/sfx/bgsound.mp3'] );

            this.load.audio ('bgsound', ['client/assets/sfx/bgsound2.ogg', 'client/assets/sfx/bgsound2.mp3'] );
            
            this.load.image('bg', 'client/assets/images/bg.png');

            this.load.image('title', 'client/assets/images/title.png');

            this.load.image('reader', 'client/assets/images/reader.png');

            this.load.spritesheet('kinds', 'client/assets/images/kinds.png', { frameWidth: 100, frameHeight: 100 });

            
            this.load.spritesheet('kinds_md', 'client/assets/images/kinds_md.png', { frameWidth: 50, frameHeight: 50 });

            this.load.spritesheet('kinds_sm', 'client/assets/images/kinds_sm.png', { frameWidth: 25, frameHeight: 25 });

            this.load.spritesheet('card', 'client/assets/images/card.png', { frameWidth: 102, frameHeight: 137 });

            this.load.spritesheet('controls', 'client/assets/images/controls.png', { frameWidth: 84, frameHeight: 82 });

            this.load.spritesheet('menu_btn', 'client/assets/images/menu_btn.png', { frameWidth: 255, frameHeight: 255 });

            this.load.spritesheet('controlsBtn', 'client/assets/images/controlsBtn.png', { frameWidth: 50, frameHeight: 50 });

            this.load.spritesheet('people', 'client/assets/images/people.png', { frameWidth: 100, frameHeight: 135 });

            this.load.spritesheet('wayindicator', 'client/assets/images/wayindicator.png', { frameWidth: 100, frameHeight: 100 });
          
            var rctW = _gW * 0.25, 
                rctH = 20 * _scale,
                rctX = (_gW - rctW )/2,
                rctY = _gH * 0.52;
        
            var txtConfig = {
                color : "#333",
                fontSize : 30 * _scale,
                fontFamily : 'Oswald'
            }

            this.loadtxt = this.add.text ( _gW/2, _gH * 0.48, 'Loading Files..', txtConfig ) .setOrigin(0.5);
            
            this.loadrect = this.add.rectangle ( rctX, rctY, rctW * 0.02, rctH, 0xff6666, 1 ).setOrigin(0);

            var smtxt = this.add.text (_gW/2, _gH*0.9, '@chalnicol', { color:'gray', fontSize: 15 *_scale, fontFamily:'Oswald'} ).setOrigin(0.5);

            //...
            this.load.on('progress', function (value) {

                var perc = Math.floor ( value * 100 );
                
                this.loadtxt.text = 'Loading Files.. ' + perc + '%';
                
                this.loadrect.width = rctW * value;

            }, this );

            this.load.on('complete', function () {
                this.loadtxt.destroy();
                this.loadrect.destroy();
            }, this );

        },
        create : function () {

            this.initMenuSound();

            this.initMenuInterface();

        },
        initMenuSound : function () {


            this.bgmusic = this.sound.add('bgsound2').setVolume(0.2).setLoop(true);
            this.bgmusic.play();

            this.music = this.sound.addAudioSprite('sfx');

        },
        initMenuInterface : function () {

            var bg = this.add.image ( _gW/2, _gH/2,'bg' ).setScale(_scale );

            var title = this.add.image ( _gW/2, -_gH/2,'title' ).setScale(_scale );

            this.tweens.add ({
                targets : title,
                y : _gH/2,
                rotation : 0,
                duration : 300,
                ease : 'Power2'
            });
            this.music.play ('move')

            var bz = 255 * _scale,
                bs = bz * 0.1,
                bx = (_gW - ( 3 * (bz + bs) - bs ))/2 + bz/2,
                by = _gH *0.55;

            for ( var i = 0; i < 3; i++ ) {

                var xs = bx + i * ( bz + bs );

                var img = this.add.image ( xs + (1050 * _scale), by, 'menu_btn', i ).setScale (_scale ).setData('id', i ).setInteractive();

                img.on ('pointerover', function () {
                    this.setTint (0xcecece);
                });
                img.on ('pointerout', function () {
                    this.clearTint ();
                });
                img.on ('pointerup', function () {
                    this.clearTint ();
                });
                img.on ('pointerdown', function () {
                    
                    this.scene.music.play('clicka');
                    this.scene.startGame ()
                });

                this.tweens.add ({
                    targets : img,
                    x : xs,
                    duration : 500,
                    easeParams : [ 1, 0.9 ],
                    ease : 'Elastic',
                    delay : (i * 300) + 300
                });
                this.time.delayedCall ( (i * 300) + 300, function () {
                    this.music.play ('move');
                }, [], this );
            }

            
            
          
           
        },
        startGame : function (  ) {

            this.bgmusic.stop();
            this.scene.start ('sceneB');
        }
 
        
    });
    
    var SceneB = new Phaser.Class({
    
        Extends: Phaser.Scene,
    
        initialize:
    
        function SceneB ()
        {
            Phaser.Scene.call(this, { key: 'sceneB' });
        },
        preload: function ()
        {
            //...
        },
        create: function ()
        {
        
            this.cardRanking = ['Royal Flush', 'Straight Flush', 'Four Of A Kind', 'Full House', 'Flushes', 'Straight', 
                                'Three of A Kind', 'Two Pair', 'One Pair', 'High Card'];

            this.cardStrVal = ['A', '2','3','4','5','6','7','8','9','10','J','Q', 'K' ];

            this.grid = [];
           
            this.cardActive = "";

            this.cardToSwitch = [];

            this.isMoving = false;

            this.initMenuSound ();

            this.initGraphics ();
            
            this.initGrid ();

            this.initIndicators();

            this.initCards ();

            this.initControls ();

            this.time.delayedCall ( 500, this.evaluateHand, [], this );


        },
        initMenuSound : function () {


            this.bgmusic = this.sound.add('bgsound2').setVolume(0.2).setLoop(true);
            this.bgmusic.play();

            this.music = this.sound.addAudioSprite('sfx');

        },
        initGraphics : function () {

            var bg = this.add.image ( _gW/2, _gH/2,'bg' ).setScale(_scale );

        },
        initGrid : function () {

            //console.log ('this');

            var cW = 100 * _scale, cH = 135 * _scale,
                cSpX = cW * 0.5, cSpY = cH * 0.3,
                csX = ( _gW - ( (4 * cSpX) + cW  ) )/2 + cW/2,
                csY = _gH * 0.15 + (cH/2);
            
            for ( var i=0; i<15; i++) {
    
                var x = Math.floor ( i/5 ),
                    y = i%5;
    
                var cX = csX + (y * cSpX),
                    cY = csY + x * ( cH + cSpY );
    
                //var rect = this.add.rectangle ( cX, cY, cW, cH, 0x3a3a3a, 0.5 ).setStrokeStyle ( 1, 0xffffff );

                this.grid.push ({
                    'x' : cX,
                    'y' : cY,
                });
            }

            this.cardData = {
                w : cW, h : cH
            }

        },
        initCards : function () {

    
            var rndOrd = this.generateRandomOrder ();

            //var rndOrd = [ 23,36,49,  13,27,15,29,17, 12,11,10,9,8  ];

            this.cardContainer = this.add.container( 0, 0 );

            var cw = this.cardData.w,
                ch = this.cardData.h;

            for ( var i = 0; i < 13 ; i++ ) {

                var knd = Math.floor ( rndOrd[i] / 13 ),
                    val = rndOrd [i] % 13,
                    str = this.cardStrVal [ val ];

                var cx = this.grid [ i + 2 ].x ,
                    cy = this.grid [ i + 2 ].y;

                var crd = new Card ( this, 'card'+ i, _gW/2, -ch, cw, ch, knd, val, str, true );

                crd.enabled ();

                crd.on ('pointerover', function () {
                    if ( !this.isSelected ) this.getAt (0).setTint ( 0xdedede );
                });
                crd.on ('pointerup', function () {
                    if ( !this.isSelected ) this.getAt (0).clearTint ();
                });
                crd.on ('pointerout', function () {
                    if ( !this.isSelected ) this.getAt (0).clearTint ();
                });
                crd.on ('pointerdown', function () {
                    this.scene.cardClick ( this.id );
                });

                this.tweens.add ({
                    targets : crd,
                    x: cx, y : cy,
                    duration : 100,
                    ease : "Power2",
                    delay : i * 20
                });

                this.cardContainer.add ( crd );

            }


        },
        initControls :  function () {

            var btns = [ 'Auto Arrange', 'Sort Levels', 'Switch Mid and Bottom Levels', 'Ready', 'Exit Game' ];

            var bz = 70 * _scale,
                bs = bz * 0.2,
                bx = _gW * 0.67,
                by = ((_gH - ( 5 * (bz+bs) - bs )) / 2 ) + ( bz/2 );
            
            for ( var i = 0; i < btns.length; i++ ) {

                var xp = bx, yp = by + i * ( bz + bs);

                var cnt = this.add.container ( xp + ( 470 * _scale), yp ).setSize (bz, bz).setInteractive ().setData ('id', i );

                var img = this.add.sprite ( 0, 0, 'controls', 0 ).setScale (_scale );

                var img2 = this.add.sprite ( 0, 0, 'controlsBtn', i ).setScale (_scale * 0.95 );

                //var txt = this.add.text ( 0, 0, i, { fontSize:bz *0.5, fontFamily:'Oswald', color : '#333'} ).setOrigin(0.5);

                cnt.add ([ img, img2 ]);

                cnt.on ( 'pointerover', function () {
                   this.getAt (0).setFrame (1);
                });
                cnt.on ( 'pointerout', function () {
                    this.getAt (0).setFrame (0);
                });
                cnt.on ('pointerup', function () {
                    this.getAt (0).setFrame (0);
                });
                cnt.on ( 'pointerdown', function () {
                    this.scene.controlClick ( this.getData('id') );
                });

                this.tweens.add ({
                    targets : cnt,
                    x : xp,
                    duration : 200,
                    ease : 'Power2',
                    delay : 1000 + (i * 100)
                });


            }

        },
        initIndicators : function () {

            this.wayReads = [];

            var bw = 200 * _scale,
                bh = 30 * _scale,
                by= 263 * _scale,
                bs = 146 * _scale;

            for ( var i = 0; i < 3; i++ ) {

                var xp = _gW/2, yp = by + i * ( bh + bs );

                //var rct = this.add.rectangle ( _gW/2, yp, bw, bh, 0xffffff, 0.5  );

                var rct = this.add.image ( xp, yp, 'reader' ).setScale(_scale);

                var txt = this.add.text ( xp, yp - bh*0.05, '---', {color : '#0a0a0a', fontSize : 16 * _scale, fontFamily : 'Oswald'}).setOrigin(0.5);

                this.wayReads.push ( txt );
            }

            var wx = 535 * _scale,
                wy = 175 * _scale;


            this.wayInd = this.add.image ( wx, wy, 'wayindicator', 0 ).setScale(_scale);

        
        },
        controlClick : function ( btnid ) {

            this.playSound ('clicka');
            
            switch ( btnid ) {
                case 0:
                    this.leaveGame ();
                break;
                case 1:
                    //..
                break;
                case 2:
                    this.arrangeCards ();
                break;
                case 3:
                    this.switchMidLow ();

                    this.evaluateHand ();
                break;
                case 4:
                    //..
                break;
                
                
            }
        },
        cardClick : function ( cardid ) {

            if ( this.isMoving) return;

            var crd = this.cardContainer.getByName ( cardid );

            var crdData = {
                id : cardid,
                x : crd.x, 
                y : crd.y, 
                indx : this.cardContainer.getIndex ( crd )
            };

            if ( this.cardActive == "" ) {
                
                this.cardToSwitch.push ( crdData );

                crd.getAt(0).setTint (0xffff66);

                crd.isSelected = true;

                this.cardActive = cardid;

            }else {

                var prevCrd = this.cardContainer.getByName ( this.cardActive );

                prevCrd.getAt (0).clearTint();

                prevCrd.isSelected = false;

                if ( this.cardActive != cardid ) {

                    this.cardToSwitch.push ( crdData );

                    this.switchCards ();

                    this.evaluateHand ();

                    
                }else {

                    this.cardToSwitch = [];

                }

                this.cardActive = "";
                    
            }

        },
        switchCards : function () {
    
            
            for ( var i = 0; i < this.cardToSwitch.length; i++ ) {

                var current = this.cardContainer.getByName ( this.cardToSwitch[i].id );

                var opp = i == 0 ? 1 : 0;

                this.cardContainer.moveTo ( current, this.cardToSwitch[opp].indx );

                this.tweens.add ({
                    targets : current,
                    x : this.cardToSwitch [ opp ].x,
                    y : this.cardToSwitch [ opp ].y,
                    duration : 100,
                    ease : 'Power2'
                })

            } 

            this.isMoving = true;

            this.cardToSwitch = [];

            this.time.delayedCall ( 200, function () {
                this.isMoving = false;
            }, [], this );

            
            
        },
        getPlayerCard : function () {

            var cardsOnHand = [];

            for ( var i = 0; i < 13; i++ ) {

                var crd = this.cardContainer.getAt (i);

                cardsOnHand.push ({
                    'val' : crd.val,
                    'knd' : crd.knd,
                    'clr' : crd.clr,
                    'id' : crd.id
                });

            }

            return {
                'top' : cardsOnHand.slice (0, 3),
                'mid' : cardsOnHand.slice (3, 8),
                'bot' : cardsOnHand.slice (8)
            };

        },
        evaluateHand : function () {
             
            var plyrCard = this.getPlayerCard ();

            var topread = this.readCard ( plyrCard.top );
            var midread = this.readCard ( plyrCard.mid );
            var botread = this.readCard ( plyrCard.bot );

            var handsGood = this.isCardsGood ( topread, midread, botread );

            this.wayReads [0].text = topread.way;
            this.wayReads [1].text = midread.way;
            this.wayReads [2].text = botread.way;

                    
            this.wayInd.setFrame ( handsGood ? 1 : 2 );

        },
        getCardData : function ( arr ) {

            var finData = {
                quads : [],
                triples : [],
                doubles : [],
                singles : [],
                flushes : [],
                totalValue : 0
            };


            for ( var i = 0; i < arr.length; i++ ) {
                    
                for ( var j = i + 1; j < arr.length; j++ ) {

                    if ( ( arr[j].val > arr[i].val && arr [i].val != 0 )  || arr [j].val == 0 ) {

                        var temp = arr [j];

                        arr.splice ( j, 1 );

                        arr.splice ( i, 0, temp );
                    }

                }

            } 
            
            var val = {}, knd = {}, totalValue = 0;

            for ( var i = 0; i < arr.length; i++ ) {
                
                if ( !val.hasOwnProperty ('val' + arr[i].val ) ) {
                    val [ 'val' + arr[i].val ] = [];
                }
                val [ 'val' + arr[i].val ].push ( arr[i] );

                totalValue += arr[i].val;

                if ( !knd.hasOwnProperty ('knd' + arr[i].knd ) ) {
                    knd [ 'knd' + arr[i].knd ] = [];
                }
                knd [ 'knd' + arr[i].knd ].push ( arr[i] );

            }

            finData ['totalValue'] = totalValue;

            var cnt = 0;

            
            for ( var i in val ) {

                if ( val [i].length == 4 ){
                    finData ['quads'].push ( val[i] );
                }
                else if ( val [i].length == 3 ) {
                    finData ['triples'].push ( val[i] );
                }
                else if ( val [i].length == 2 ) {
                    finData ['doubles'].push ( val[i] );
                }
                else {
                    finData ['singles'].push ( val[i][0] );
                }

            }
     
            for ( var j in knd ) {
                if ( knd [j].length >= 5 ) {
                    finData ['flushes'].push ( knd [j] );
                }
            }

            return finData;

        },
        sortCard : function ( data ) {
            
            //sort
            var sorted = [];

            for ( var i = 0; i < data.quads.length; i++ ) {
                sorted = sorted.concat ( data.quads[i] );
            }
            for ( var i = 0; i < data.triples.length; i++ ) {
                sorted = sorted.concat ( data.triples[i] );
            }
            for ( var i = 0; i < data.doubles.length; i++ ) {
                sorted = sorted.concat ( data.doubles [i] );
            }

            sorted = sorted.concat ( data.singles );

            return sorted;

        },
        readCard : function ( data ) {

            var evalCard = this.getCardData ( data );

            var sorted = this.sortCard ( evalCard );

            var score = 0;

            if ( sorted.length == 5 ) {


                if ( evalCard.flushes.length > 0 && this.isStraight (sorted) && evalCard.totalValue == 42 ) {
                    score = 0;
                }
                else if ( evalCard.flushes.length > 0 && this.isStraight (sorted) ) {
                    score = 1;
                }
                else if ( evalCard.quads.length > 0 ) { //4 of A Kind
                    score = 2;
                }
                else if ( evalCard.triples.length == 1 && evalCard.doubles.length == 1 ) { //Full House
                    score = 3;
                }
                else if ( evalCard.flushes.length == 1 ) { //Flushes
                    score = 4;
                }
                else if ( this.isStraight (sorted) || this.isStraight (sorted, true) ){ //straight
                    score = 5;
                }
                else if ( evalCard.triples.length == 1 && evalCard.doubles.length == 0  ) {//3 of A Kind
                    score = 6;
                }
                else if ( evalCard.doubles.length == 2 && evalCard.singles.length == 1 ) {//2 pairs
                    score = 7;
                }
                else if ( evalCard.doubles.length == 1 && evalCard.singles.length == 3 ) {//1 pairs
                    score = 8;
                }
                else {
                    score = 9;
                }
            
            }else {
            
            
                if ( evalCard.triples.length == 1 ) {//3 of A Kind
                    score = 6;
                }
                else if ( evalCard.doubles.length == 1 ) {//1 pairs
                    score = 8;
                }
                else {
                    score = 9;
                }
            
            }
        
            var way = this.cardRanking [ score ] + ' (' + this.cardStrVal [ sorted [0].val ] + ')';

            return  { 
                'score' : score, 
                'way' : way, 
                'sorted' : sorted 
            };

        }, 
        isCardsGood : function ( top, mid, bot ) {

            if ( (mid.score < bot.score) || (top.score < mid.score) ) return false;

            if ( mid.score == bot.score ) {

                var done = false, i = 0;

                while ( !done ) {

                    var arra = mid.sorted[i].val, arrb = bot.sorted[i].val;

                    if ( arra != arrb ) {
                        
                        if ( (arra > arrb && arrb != 0) ||  (arra < arrb && arra == 0) ) return false;

                        done = true;
                    }

                    i++;

                }

            }

            if ( top.score == mid.score ) {

                var done = false, i = 0;

                while ( !done && i < 3 ) {

                    var arra = top.sorted[i].val, arrb = mid.sorted[i].val;

                    if ( arra != arrb ) {

                        if ( (arra > arrb && arrb != 0) ||  (arra < arrb && arra == 0) ) return false;

                        done = true;
                    }

                    i++;

                }


            }
            
            return true;

        },
        arrangeCards : function () {

            var plyrCard = this.getPlayerCard ();

            var topEval = this.getCardData ( plyrCard.top ),
                midEval = this.getCardData ( plyrCard.mid ),
                botEval = this.getCardData ( plyrCard.bot );

            var topSorted = this.sortCard ( topEval ),
                midSorted = this.sortCard ( midEval ),
                botSorted = this.sortCard ( botEval );

            var fin = topSorted.concat ( midSorted, botSorted );

            for ( var i = 0; i < fin.length; i++ ) {

                var crd = this.cardContainer.getByName ( fin[i].id );

                this.cardContainer.moveTo ( crd, i );

                this.tweens.add ({
                    targets : crd,
                    x : this.grid [ i + 2 ].x,
                    duration : 100,
                    ease : 'Power2'
                })

            } 

        },
        switchMidLow : function () {

            var plyrCard = this.getPlayerCard ();

            var fin = plyrCard.bot.concat ( plyrCard.mid );


            for ( var i = 0; i < fin.length; i++ ) {

                var crd = this.cardContainer.getByName ( fin[i].id );

                this.cardContainer.moveTo ( crd, i + 3 );

                this.tweens.add ({
                    targets : crd,
                    y : this.grid [ i + 5 ].y,
                    duration : 100,
                    ease : 'Power2'
                })

            } 

        },
        sortLevels : function () {

            var myHand = this.splitPlayersHand ( this.hand );

            var topCard = this.evaluateCard ( myHand.top ),
                midCard = this.evaluateCard ( myHand.mid ),
                botCard = this.evaluateCard ( myHand.bot );

            var newTop = this.sortCard ( topCard ),
                newMid = this.sortCard ( midCard ),
                newBot = this.sortCard ( botCard );

            var newArr = [];
            newArr = newArr.concat ( newTop, newMid, newBot );

            this.hand = newArr;
            
            this.arrangeCards();

        },
        isStraight : function ( arr, low = false ) {

            var initValue = arr[0].val;

            if ( initValue == 0 ) {

                if ( low ) {
                    initValue = 5;
                }else {
                    initValue  = 13;
                }
            }

            for ( var i=0; i<(arr.length - 1); i++) {

                if ( arr[i+1].val != (initValue - 1) ) return false;

                initValue = arr[i + 1].val;     
            }

            return true;

        },
        generateRandomOrder : function () {

            var tempArr = [];

            for ( var i = 0; i < 52; i++ ) {
                tempArr.push (i);
            }

            var finArr = [];

            while ( tempArr.length > 0 ) {

                var rnd = Math.floor ( Math.random() * tempArr.length );

                finArr.push ( tempArr [ rnd ] );

                tempArr.splice ( rnd, 1 );
            }

            return finArr;

        },
        leavePrompt : function () {

            this.isPrompted = true;

            this.promptContainer = this.add.container ( 0, 0 );

            var rect = this.add.rectangle ( _gW/2, _gH/2, 450*_scale, 200*_scale, 0x2e2e2e, 0.9 ).setInteractive();;

            var txtr = this.add.text ( _gW/2, _gH * 0.44, 'Are you sure you want to leave?', { color:'#f4f4f4', fontSize:26*_scale, fontFamily:'Oswald'}).setOrigin(0.5);

            this.promptContainer.add ( [rect, txtr] );

            var bw = 130*_scale, bh = 45 * _scale, bs= bw * 0.15;

            var fx = (_gW - (2 * ( bw + bs ) - bs))/2 + bw/2,
                fy = _gH *0.56;

            for ( var i = 0; i < 2; i++ ) {

                var miniContainer = this.add.container ( fx + i * ( bw+bs), fy ).setSize(bw, bh).setData('id', i).setInteractive ();

                var rectbtn = this.add.rectangle ( 0, 0, bw, bh, 0x9a9a9a, 1 );

                var txtbtn = this.add.text (0, 0, i == 0? 'Yes' : 'No', { color:'#333', fontSize:bh*0.5, fontFamily:'Oswald'}).setOrigin (0.5);

                miniContainer.add ( [rectbtn, txtbtn]);

                miniContainer.on ('pointerover', function () {
                    this.getAt (0).setFillStyle ( 0xa3a3a3, 1 );
                });
                miniContainer.on ('pointerout', function () {
                    this.getAt (0).setFillStyle ( 0xcecece, 1 );
                });
                miniContainer.on ('pointerup', function () {
                    this.getAt (0).setFillStyle ( 0xcecece, 1 );
                });
                miniContainer.on ('pointerdown', function () {
                    
                    this.scene.playSound ('clicka');

                    if ( this.getData ('id') == 0 ) {
                        this.scene.leaveGame ();
                    }else {
                        this.scene.removePrompt();
                    }
                });

                this.promptContainer.add ( miniContainer );

            }

            //..
        },
        removePrompt : function () {

            if ( !this.isPrompted ) return;

            this.isPrompted = false;

            this.promptContainer.destroy ();

        },
        resetGame : function () {

            this.removePrompt ();

            this.cardContainer.destroy();

            for ( var i = 0; i < 4; i++ ) {
                var home = this.mainContainer.getByName ('home' + i );
                home.setData ({
                    resided : false,
                    topVal : -1, kind : -1
                });
            }

            this.time.delayedCall ( 300, this.initCards, [], this );

            //this.initCards ();
        },
        leaveGame : function () {

            this.bgmusic.stop ();
            this.scene.start ('sceneA');

        },
        playSound : function ( snd, vol=0.5 ) {
            this.music.play ( snd, { volume : vol });
        }
       
    
    });
    
    // Container Class..
    var Card =  new Phaser.Class({

        Extends: Phaser.GameObjects.Container,

        initialize:

        function Card ( scene, id, x, y, width, height, knd, val, strVal, isFlipped )
        {

            Phaser.GameObjects.Container.call( this, scene )

            this.setPosition(x, y).setSize( width, height).setName ( id );

            this.id = id;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.clr = knd < 2 ? 0 : 1,
            this.knd = knd;
            this.val = val;
            this.strVal = strVal;
            this.currentPost = '';
            this.isFlipped = isFlipped;
            this.isEnabled = false;
            this.row = -1;
            this.col = -1;
            this.home = 0;
            this.isSelected = false;


            var cardbg = scene.add.image ( 0, 0, 'card', isFlipped ? 0 : 1 ).setScale (_scale );

            var txtConfig = { 
                fontSize: height*0.25, 
                fontFamily:'Oswald', 
                color : this.clr == 0 ? 'black' : 'red' 
            };


            var frame = 0;

            if ( val >= 10 ) {
                frame = this.clr == 0 ? val - 9 : (val - 9) + 4; 
            }

            var txt = scene.add.text ( -width *0.3, -height*0.32, strVal, txtConfig ).setOrigin (0.5).setVisible (isFlipped);

            var kind_sm = scene.add.sprite ( -width *0.3 , -height*0.07, 'kinds_md', knd ).setScale ( width*0.3/50 ).setVisible (isFlipped);

            var kind_lg = scene.add.sprite ( width* 0.13, height*0.2, 'kinds', knd ).setScale ( width*0.85/100 ).setVisible (isFlipped).setAlpha ( val > 9 ? 0.3 : 1 );

            var txte = scene.add.text ( width *0.3, -height*0.4, strVal, txtConfig ).setOrigin (1, 0.5).setFontSize ( height * 0.12 ).setVisible (isFlipped);

            var kind_xs = scene.add.image (width *0.45, -height*0.4 , 'kinds_sm', knd ).setOrigin (1, 0.5).setScale (width*0.18/25).setVisible (isFlipped);

            var img  = scene.add.sprite ( 0,0, 'people', frame ).setScale ( _scale ).setVisible (isFlipped);

            //var txtid = scene.add.text ( -width *0.38, height*0.3, id, txtConfig ).setOrigin (0.5).setFontSize ( height * 0.12 ).setRotation (Math.PI/180 * 90);

            this.add ( [ cardbg, txt, kind_sm, kind_lg, txte, kind_xs, img ] );

            scene.children.add ( this );

        },

        flip: function ( state = 'up' ) {

            var isUp = state == 'up';

            this.getAt ( 0 ).setFrame ( isUp ? 0 : 1 );
            
            for ( var i = 0; i < 6; i++) {
                this.getAt ( i + 1 ).setVisible ( isUp );
            }   
            
            return this;

        },
        enabled : function ( state = true ) {

            this.isEnabled = state;

            if ( state ) {
                this.setInteractive ();
            }else {
                this.disableInteractive ();
            }
            return this;

        },
        setPost : function ( cp, col=0, row=0 ) {

            this.currentPost = cp; 

            this.col = col;
            this.row = row;
            
            return this;
        },
        setHome : function ( nmbr ) {

            this.col = 100;
            this.row = 100;

            this.currentPost = 'home';
            this.home = nmbr;
        }
   
    });

} 




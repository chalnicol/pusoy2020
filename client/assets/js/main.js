
window.onload = function () {

    var SceneA = new Phaser.Class({

        Extends: Phaser.Scene,
    
        initialize:
    
        function SceneA ()
        {
            Phaser.Scene.call(this, { key: 'sceneA' });
        },
        preload: function ()
        {

            this.load.spritesheet('thumbs', 'assets/images/spritesheet1.png', { frameWidth: 50, frameHeight: 50 });

            /* this.load.on('progress', function (value) {

                var perc = Math.floor ( value * 100 );
                console.log ( perc );
    
            }); */

        },
        create: function ()
        {

            var graphics = this.add.graphics();
                graphics.fillStyle ( 0x3c3c3c, 1);
                graphics.lineStyle ( 2, 0x9c9c9c );
            
            var width = config.width * 0.8, 
                height = config.height * 0.1, 
                x = (config.width - width)/2, 
                y = config.height*0.1;
    
            graphics.fillRoundedRect ( x, y, width, height, 5 );
    
            graphics.beginPath();
            graphics.moveTo(x, config.height*0.22);
            graphics.lineTo(x + width, config.height*0.22);
            graphics.strokePath();
    
            graphics.lineStyle ( 1, 0xffffff);
            graphics.beginPath();
            graphics.moveTo( x, config.height*0.221);
            graphics.lineTo( x + width, config.height*0.221);
            graphics.strokePath();
    
            var textHeight = Math.floor (height * 0.31);
    
            var text = this.add.text ( config.width*0.5, config.height*0.1 + height/2, 'Pusoyan', { color:'#333', fontSize: textHeight +'px',fontStyle:'bold', fontFamily:'Tahoma'}).setOrigin (0.5);
            text.setStroke('#e5e5e5', 5);
            text.setShadow( 0, 0, '#999', 2, true, true );
    
            var bW = config.width * 0.58,
                bH = config.height * 0.06,
                bS = bH * 0.2,
                sX = ( config.width - bW ) /2,
                sY = config.height * 0.35;
    
            var buts = [
                { value : 'vs Computer', id: 'vsai_btn'},
                { value : 'vs Online Players', id: 'vsonline_btn'}, 
                //{ value : 'vs Friends', id: 'vsfriends_btn'}, 
               
            ];
    
            var txtConfig = {
                color : '#fff', fontSize : Math.floor( bH * 0.33 ) + 'px', fontFamily : 'Tahoma', fontStyle:'bold'
            };
    
           
            var _this = this;
    
            for ( var i=0; i<buts.length; i++) {
    
                var bute = new MyButton ( this, buts[i].id, 0, i * (bH + bS) + sY, bW, bH, buts[i].value, 0x333333 ); 
    
                bute.on('pointerover', function () {
                    this.change( 0x4e4e4e );
                });
                bute.on('pointerout', function () {
                    this.change( 0x333333 );
                });
                bute.on('pointerdown', function () {
                    //console.log ( this.id );
                    _this.scene.start ('SceneB');
                });
    
                this.tweens.add({
                    targets: bute,
                    x : config.width/2,
                    duration: 1000,
                    delay: i * 100,
                    ease: 'Elastic',
                    easeParams: [ 1, 0.5 ],
                    //onCompleteParams : [i]
                });
    
            }
    
        }
        
    });
    
    var SceneB = new Phaser.Class({
    
        Extends: Phaser.Scene,
    
        initialize:
    
        function SceneB ()
        {
            Phaser.Scene.call(this, { key: 'SceneB' });
        },
        init : function ( data ) {
            
            this.grid = [];
            this.ways = [];

            this.cards = {};
           

            this.cardActive = '';
    
        },
        preload: function ()
        {

            
        
        },
        create: function ()
        {
            this.initGraphicsPlacements ();
            this.initCards ();       
            this.moveCards (); 

            this.initControls();

        },
        initPlayers : function () {
    
            var p1 = new Player ('self', 'Charlou');
            var p2 = new Player ('oppo', 'Charlie');
    
            this.player['self'] = p1;
            this.player['oppo'] = p2;
            
        },
        initGraphicsPlacements: function () {
    
            var cW = config.width * 0.25,
                cH = config.height * 0.18,
                cGx = cW * 0.32,
                cGy = cH * 0.22,
                csW = (cGx * 4) + cW,
                csX = ( config.width - csW )/2 + cW/2,
                //csX = config.width * 0.12 + (cW/2),
                csY = config.height * 0.2 + (cH/2);
            
            for ( var i=0; i<15; i++) {
    
                var x = Math.floor ( i/5 ),
                    y = i%5;
    
                var cX = csX + y * cGx,
                    cY = csY + ( x * ( cH + cGy ) );
    
                this.grid.push ({
                    'x' : cX,
                    'y' : cY,
                });
    
            }
    
            this.cardW = cW;
            this.cardH = cH;

            //wayReaders...

            var th = cGy * 0.5,
                ts = cH + cGy,
                tx = config.width/2,
                ty = config.height * 0.4;

            var txtConfig = {
                color : '#3a3a3a',
                fontSize : th,
                fontFamily : 'Trebuchet MS',
                fontStyle : 'bold'
            };

            for ( var i=0; i<3; i++) {
                
                var txt = this.add.text ( tx, ty + i * ts, 'Cards Here', txtConfig ).setOrigin ( 0.5 );
                
                this.ways.push ( txt );

            }
            

            
    
        }, 
        initCards : function () {
    
            var _this = this;
    
            var cW = this.cardW,
                cH = this.cardH,
                cG = cW * 0.15,
                cT = (cG * 12) + cW
                cX = (config.width - cT)/2 + (cW/2),
                cY = config.height * 0.75 + ( cH/2);
    
            var order = this.shuffleCards();
    
            for ( var i=0; i<13; i++) {
    
                var cnt = order [i];
    
                var clr = Math.floor ( order[i]/ 26 );
    
                var tpe = Math.floor ( order[i]/ 13 );
    
                var card = new Card ( this, 'card' + i ,  cX + i * cG, cY, this.cardW, this.cardH, cnt, clr, tpe, order[i] % 13, i );
    
                card.on ('pointerdown', function () {
                    
    
                    if ( _this.cardActive != '' && _this.cardActive != this.id ) {
    
                        _this.switchCards ( this.id );
    
                    }else {
    
                        this.isActive = !this.isActive;
    
                        this.change( this.isActive ? 0xffff99 : 0xffffff );
                    
                        _this.cardActive = this.isActive ? this.id : '';
    
                    }
    
                });

                this.cards['card' + i] = card;
            
            }
            
        }, 
        initControls :  function () {

            var rW = config.width,
                rH = config.height *0.1,
                rX = config.width/2,
                rY = config.height - rH/2;

            var rect = this.add.rectangle ( rX, rY, rW, rH, 0x3a3a3a, 0.5 );

            var bCnt = 4,
                bS = rH * 0.65,
                bG = config.width *0.03,
                bT = bCnt * ( bS + bG ) - bG,
                bX = (config.width - bT) /2 + (bS/2),
                bY = rY;
            
            for ( var i = 0; i < bCnt; i++ ) {

                var cnt = new ControlButton ( this, 'cnt' + i, bX + i * ( bS + bG), bY, bS, i ).setAlpha ( 0 );

                this.tweens.add ({
                    targets : cnt,
                    alpha : 1,
                    duration : 800,
                    ease : 'Power2',
                    delay : 1000
                });


            }

        },
        shuffleCards : function () {
    
            var tmp_arr = [];
            for ( var i = 0; i < 52; i++ ) {
                tmp_arr.push (i);
            };
    
            var fin_arr = [];
    
            while ( tmp_arr.length > 0) {
    
                var rnd = Math.floor ( Math.random() * tmp_arr.length );
    
                fin_arr.push ( tmp_arr[rnd] );
    
                tmp_arr.splice ( rnd, 1 );
    
            }
    
            return fin_arr;
    
        },
        switchCards : function (cardid) {
    
    
            var c1 = { 
                x : this.cards[this.cardActive].x, 
                y : this.cards[this.cardActive].y,
                depth : this.cards[this.cardActive].depth
            };
            var c2 = { 
                x : this.cards[cardid].x, 
                y : this.cards[cardid].y,
                depth : this.cards[cardid].depth
            };
            
            this.cards [ this.cardActive ].isActive = false;
            this.cards [ this.cardActive ].change (0xffffff);
            this.cards [ this.cardActive ].depth = c2.depth;
    
            this.tweens.add ({
                targets : this.cards [ this.cardActive ],
                x : c2.x, y : c2.y,
                duration : 200,
                ease : 'Power2',
            });
            this.tweens.add ({
                targets : this.cards [ cardid ],
                x : c1.x, y : c1.y,
                duration : 200,
                ease : 'Power2',
            });
            
            this.cards [ cardid ].depth = c1.depth;
    
            this.cardActive = '';
            
        },
        moveCards: function () {

            var count = 1;

            for ( var i = 0; i < 13; i++) {

                var card = this.cards [ 'card' + ( 12 - i) ];

                this.tweens.add ( {

                    targets : card,
                    x : this.grid [i + 2].x,
                    y : this.grid [i + 2].y,
                    duration : 200,
                    ease : 'Power2',
                    delay : i * 50,
                    onComplete : function () {
                        count++;

                        this.targets[0].flipOpen();
                        this.targets[0].setDepth (count) 
                    }
                });

            }

            var hand = {
                top : [], 
                mid : [], 
                bot : []
            }

        }
       
    
    });
    
    
    //..Buttons...
    var MyButton =  new Phaser.Class({
    
        Extends: Phaser.GameObjects.Container,
    
        initialize:
    
        function MyButton ( scene, id, x, y, width, height, text, bgColor = 0x3c3c3c  )
        {
    
            Phaser.GameObjects.Container.call(this, scene)
    
            this.setPosition(x, y).setSize(width, height).setInteractive();
    
            this.id = id;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.isActive = false;
            this.isClicked = false;
            this.bgColor = bgColor;
            
            this.shape = scene.add.graphics ( { fillStyle: { color: bgColor, alpha: 1 } } );
            this.shape.fillRoundedRect ( -width/2, -height/2, width, height, 3);
    
            var txtConfig = { 
                fontFamily: 'Verdana', 
                //fontStyle : 'bold',
                fontSize: Math.floor(height * 0.4), 
                color: '#fff' 
            };
    
            this.text = scene.add.text ( 0, 0, text, txtConfig ).setOrigin(0.5);
    
            //add to container...
            this.add ([this.shape, this.text]);
    
    
            scene.children.add ( this );
        },
    
        change : function ( clr ) {
    
            this.shape.clear();
            this.shape.fillStyle( clr, 1);
            this.shape.fillRoundedRect ( -this.width/2, -this.height/2, this.width, this.height, 5);
        },
       
        
    });
    //..ControlButtons 
    var ControlButton =  new Phaser.Class({
    
        Extends: Phaser.GameObjects.Container,
    
        initialize:
    
        function ControlButton ( scene, id, x, y, size, frame, bgColor = 0xdedede )
        {
    
            Phaser.GameObjects.Container.call(this, scene)
    
            this.setPosition(x, y).setSize(size, size).setInteractive();
    
            this.id = id;
            this.x = x;
            this.y = y;
            this.size = size;
            this.frame = frame;
            this.bgColor = bgColor;
            
            this.circ = scene.add.circle ( 0, 0, size/2, bgColor, 1 );
            this.circ.setStrokeStyle ( 1, 0x6c6c6c );
    
            var txtConfig = { 
                fontFamily: 'Trebuchet MS', 
                fontSize: Math.floor(size * 0.5), 
                color: '#3a3a3a' 
            };
    
            this.text = scene.add.text ( 0, 0, 'B', txtConfig ).setOrigin(0.5);
            
            var imgSize = size * 0.8;

            this.image = scene.add.image ( 0, 0, 'thumbs', this.frame ).setScale ( imgSize/50 );

            //add to container...
            this.add ([this.circ, this.text]);
    
            scene.children.add ( this );
        },
    
        change : function ( clr ) {
            //....
        },
       
        
    });

    //..Cards...
    var Card =  new Phaser.Class({
    
        Extends: Phaser.GameObjects.Container,
    
        initialize:
    
        function Card ( scene, id, x, y, width, height, cnt, clr, type, val, depth )
        {
            Phaser.GameObjects.Container.call(this, scene)
    
            this.setPosition(x, y).setSize(width, height).setDepth(depth);
    
            this.scene = scene;
            this.id = id;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.cnt = cnt;
            this.clr = clr;
            this.type = type;
            this.val = val;
            this.isOpen = false;
            this.isActive = false;
            this.depth = depth;
    
            this.bg = scene.add.graphics ( { fillStyle: { color: 0xffffff,  alpha:1 }, lineStyle : { color: 0x9c9c9c, width:1 } });
            this.bg.fillRoundedRect ( -width/2, -height/2, width, height, 5 );
            this.bg.strokeRoundedRect ( -width/2, -height/2, width, height, 5 );
    
            var top = -height/2,
                left = -width/2;
    
            var coverW = width * 0.8,
                coverH = height * 0.8,
                coverX = left + width * 0.1,
                coverY = top + height * 0.1;
            
            var r = 9, c = 4;
    
            var bW = coverW / c,
                bH = coverH / r;
    
            this.cover = this.scene.add.graphics();
            this.cover.lineStyle ( 1, 0xffffff );
            this.cover.fillStyle ( 0xff0000, 0.5 );
    
            for ( var i = 0; i< (r*c) ; i++ ) {
    
                var x = Math.floor ( i/c ),
                    y = i % c;
    
                this.cover.fillRect ( coverX + y*bW, coverY + x*bH, bW, bH  );
                this.cover.strokeRect ( coverX + y*bW, coverY + x*bH, bW, bH  );
            }
    
            var rad = this.width*0.05;
    
            this.cover.fillStyle (0x333333, 0.5);
    
            for ( var j = 0; j < 3; j++ ) {
    
                var y = top + (this.height * 0.33) + (j * this.height * 0.17);
    
                this.cover.fillCircle ( 0, y, rad);
            }
            
            this.add ([ this.bg, this.cover ]); // add elements to this container..
    
            scene.children.add ( this ); //add to scene...
    
        },
    
        change : function ( clr ) {
            //
            this.bg.clear();
            this.bg.fillStyle ( clr, 1);
            this.bg.fillRoundedRect ( -this.width/2, -this.height/2, this.width, this.height, 5);
            this.bg.strokeRoundedRect ( -this.width/2, -this.height/2, this.width, this.height, 5);
    
        },
        flipOpen : function () {
    
            this.setInteractive();
            
            this.isOpen = true;
            
            this.cover.clear();
    
            var txtConfig = { 
                fontFamily: 'Trebuchet MS', 
                fontSize: Math.floor(this.height * 0.14), 
                fontStyle : 'bold',
                color: this.clr == 0 ? 'red' : 'black' 
            };
    
            var txtConfigSymbol = { 
                fontFamily: 'Trebuchet MS', 
                fontSize: Math.floor(this.height * 0.2), 
                fontStyle : 'bold',
                color: this.clr == 0 ? 'red' : 'black' 
            };
    
            var top = -this.height/2,
                left = -this.width/2;
    
            var typ_txt = '♦♥♠♣';
    
            var val_arr = ['A','2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] ;
    
            var ttX = left + this.width * 0.12,
                ttY = top + this.height * 0.1;
    
            this.text = this.scene.add.text ( ttX, ttY, val_arr[this.val], txtConfig ).setOrigin(0.5);
    
            this.text2 = this.scene.add.text ( ttX, top + this.height * 0.22, typ_txt.charAt(this.type), txtConfigSymbol ).setOrigin(0.5);
    
            var tbX = left + this.width * 0.88,
                tbY = top + this.height * 0.9;
    
            this.text3 = this.scene.add.text ( tbX, tbY, val_arr[ this.val], txtConfig ).setOrigin(0.5).setRotation( Math.PI/180 * 180);
    
            this.text4 = this.scene.add.text ( tbX, top + this.height * 0.78, typ_txt.charAt(this.type), txtConfigSymbol ).setOrigin(0.5).setRotation( Math.PI/180 * 180);
    
            var txtConfig2 = { 
                fontFamily: 'Arial', 
                fontSize: Math.floor(this.height * 0.62), 
                fontStyle : 'bold',
                color: this.clr == 0 ? 'red' : 'black' 
            };
    
            this.text5 = this.scene.add.text ( 0, 0, typ_txt.charAt(this.type), txtConfig2 ).setOrigin(0.5)
            this.text5.setStroke('#e5e5e5', 5);
            this.text5.setShadow( 0, 0, '#999', 5, true, true );
    
            this.add ([ this.text, this.text2, this.text3, this.text4, this.text5 ]); // add elements to this container..
    
    
        },
        
    
    });
    //..PlayerIndicators...
    var PlayerIndicator = new Phaser.Class({
    
        Extends: Phaser.GameObjects.Container,
    
        initialize:
    
        function PlayerIndicator ( scene, id, x, y, width, height, name, max )
        {
            Phaser.GameObjects.Container.call(this, scene)
    
            this.setPosition(x, y).setSize( width, height);
    
            this.id = id;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.winClr = ( id == 'self' ? 0x00cc00 :  0xff3333 );
            this.name = name;
            this.max = max;
            this.win = 1;
    
            console.log ('asdf', x)
    
            this.shape = scene.add.graphics ( { fillStyle: { color: 0xf3f3f3 ,  alpha: 0.7 }, lineStyle : { color: 0xa4a4a4, width:1 } });
    
            this.shape.fillRoundedRect ( -width/2, -height/2, width, height, 3);
            this.shape.strokeRoundedRect ( -width/2, -height/2, width, height, 3);
    
            //players name...
            var top = -height/2, 
                left = -width/2;
    
            var txtConfig = { 
                fontFamily: 'Verdana', 
                fontSize: Math.floor( height * 0.3 ), 
                fontStyle: 'bold',
                color: '#333' 
            };
    
            var tX = left + (width * 0.04),
                tY = top + (height * 0.2); 
    
            this.text = scene.add.text ( tX, tY, name, txtConfig ).setOrigin(0);
    
    
            var bW = width * 0.025,
                bS = bW * 0.2,
                sX = left + (width * 0.04),
                sY = top + (height * 0.6); 
                
            this.wins = scene.add.graphics();
    
            this.wins.fillStyle ( 0x9e9e9e, 1 );
            for ( var i=0; i<this.max; i++) {
                this.wins.fillRect ( sX + i*( bW + bS ), sY, bW, bW ); 
            }
            this.wins.fillStyle ( this.winClr, 1 );
            for ( var i=0; i<this.win; i++) {
                this.wins.fillRect ( sX + i*( bW + bS ), sY, bW, bW ); 
            }
            
    
            this.add ([ this.shape, this.text, this.wins ]); // add elements to this container..
    
    
            scene.children.add ( this ); //add to scene...
            
        }
    
    });


    var parentDiv = document.getElementById('game_div');

    var config = {

        type: Phaser.AUTO,
        width: parentDiv.clientWidth,
        height: parentDiv.clientHeight,
        backgroundColor: '#ccc',
        audio: {
            disableWebAudio: false
        },
        parent:'game_div',
        scene: [ SceneA, SceneB ]

    };

    var game = new Phaser.Game(config);


} 




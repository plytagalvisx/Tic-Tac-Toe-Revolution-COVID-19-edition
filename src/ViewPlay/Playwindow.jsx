import React from "react";
import firebase from "../firebaseConfig/firebaseConfig";
import * as PIXI from "pixi.js";
import InventoryModal from "../Inventory/InventoryModal";
import "./Playwindow.css";
import MultiplayerSession from "../PlaySession/MultiplayerSession";
import SingleplayerSession from "../PlaySession/SingleplayerSession";
import ScreenBox from "../StoryMode/ScreenBox";

export default class playWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            virus_health: 100, // load in virus_health from pubnub
            player_health: 100, // load in from user info firebase database.
            virus_max_health: 100,
            player_max_health: 100,
            stage: 0, // load in from user info, current state.
            virusStage: 0, // load from firebase.
            Multiplayer:false, // if singleplayer, false, else true;
            notShowingPlayer:true, // changes based on view.
            bothHearts:0,// the amount of hearts added.
            xPlayer:"",
            oPlayer:"",
            currentUser:"",
            image:true,
        };
        
        // this.loader = new PIXI.Loader();

        this.database = firebase.database();

        this.width = 840; //window.innerWidth / 2 * 0.875 //1024; // 426 // best yet : 576
        this.height = 436; //window.innerHeight / 2 * 0.9  //576; // 272 // best yet : 576

        this.app = new PIXI.Application({
            width:this.width,
            height:this.height,
            antialiasing: true,
            sharedLoader: true, 
            sharedTicker: true,
        });
        this.AgainstVirus = new PIXI.Container();
        this.state.player_max_health = 100; // update with players health;
        this.Enemy = 0;
        this.You = 0;
        this.delta = 0;
        this.sharedLoader = new PIXI.Loader();
        this.floatingTicker = new PIXI.Ticker();
        this.movementTicker = new PIXI.Ticker();
        this.shakeEffect = new PIXI.Ticker();
        this.backgroundNumber = (Math.floor(Math.random()*Math.floor(3)) + 1);
        this.healthbar12 = new PIXI.Container();
        this.healthbar22 = new PIXI.Container();
        this.audio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
        this.animation = this.animation.bind(this);
    }

    addHealthBar(y,color,text,healthpoints,max_health,endText){

        let healthBar = new PIXI.Container();
        healthBar.position.set(0, y);

        //Create the black background rectangle
        let innerBar = new PIXI.Graphics();
        innerBar.beginFill(0x000000);
        innerBar.drawRect(0, 0, this.width*(healthpoints/max_health), 16);
        innerBar.endFill();
        healthBar.addChild(innerBar);

        //Create the front red rectangle
        let outerBar = new PIXI.Graphics();
        outerBar.beginFill(color);
        outerBar.drawRect(0, 0, this.width*(healthpoints/max_health), 16);
        outerBar.endFill();
        innerBar.addChild(outerBar);

        healthBar.outer = outerBar;

        healthBar.outer.width = this.width*(healthpoints/max_health);

        let style = ({
            fontSize: 16,
            fill: 0xFFFFFF,
            fontFamily: "munro",
            fontWeight: "bolder",
            dropShadow: true,
            dropShadowAlpha: 1,
            dropShadowBlur: 0,
            dropShadowDistance: 3,
            dropShadowColor: "#000000",
        });

        let alltext = new PIXI.Container();
        let message = new PIXI.Text(text + Math.ceil(healthpoints) + endText,style);
        message.x = (this.width/2-message.width/2);
    
        alltext.addChild(message);
        innerBar.addChild(alltext);


        this.heart(this.width,y);
        
        return healthBar
        }


    heart = (healthBar,y) => {
        let heart = 0;
        let scale = 0.07;

        this.sharedLoader
        .load((load,resources) => {
            heart = new PIXI.Sprite(resources.heartHP.texture);
            heart.scale.set(scale,scale);
            if(y == 0) {
            heart.y = y + heart.width-12;
            heart.x = healthBar - heart.width - 9;
            }
            else
            heart.y = y - heart.height;
            

            if(this.state.bothHearts <= 1){
            let upordown = 0; // 0 is up, 1 is down
            this.app.ticker.add(() => {
                if(upordown != 1){
                    if(scale >= 0.09) {
                        upordown = 1;
                    }
                    scale += 0.00023; 
                }
                else{
                    if(scale == 0.07)
                    upordown = 0;
                    scale -= 0.00023;
                }

                heart.scale.set(scale,scale);

            })

            
            this.AgainstVirus.addChild(heart);
            this.setState({
                bothHearts: this.state.bothHearts + 1,
            })
            }
        })



    }

    async componentDidMount(){
        
       await this.updateVirus();

        this.addSprites();
        this.addBackground();
        this.ground.appendChild(this.app.view);
        this.switchStage(this.state.stage);
    }

    componentWillUnmount(){
        this.sharedLoader = new PIXI.Loader();
        PIXI.utils.clearTextureCache();
    }


    async updateVirus(){
        if(this.state.Multiplayer === false){
        await this.database.ref("/Virus/" + this.state.stage).once('value', (snap) => {
            // WILL NEED TO ADD STAGE ENTRY IN DATABASE FOR EACH VIRUS
            let stage = (snap.val() && snap.val());
            console.log(stage);
        });
        await this.database.ref("/Virus/" + this.props.virus).once('value', (snap) => {
            let virus = snap.val();
            this.setState({
                virus_image1: (virus && virus.image1),
                virus_image2: (virus && virus.image2),
                virus_image3: (virus && virus.image3),
                virus_health: (virus && virus.health),
                virus_max_health: (virus && virus.health),

                virus_image: (virus && virus.image1),
                virus_name: (virus && virus.name),
                virus_storyText: (virus && virus.storyText)

            });
        });
    }
    console.log(this.props.roomJoiner);
    console.log(this.props.otherPlayer_o);
    console.log(this.props.otherPlayer_x);
     this.setState({
         currentUser: this.props.roomJoiner,
         oPlayer: this.props.otherPlayer_o,
         xPlayer: this.props. otherPlayer_x,
         Multiplayer: this.props.Multiplayer
     })
        await this.database.ref("/User/" + this.props.user.uid).once('value', (snap) => {
            let user = snap.val();
            this.setState({
                player_health: (user && user.health),
                player_max_health: (user && user.health),
                image: (user && user.image).slice(0,2),
            });
        });
    }


    switchStage(x){
        switch(x){
            case 0:
                this.app.stage.addChild(this.AgainstVirus);
                
                if(this.state.Multiplayer === true)
                this.addEnemy("p"); //changes to virus;
                else
                this.addEnemy(0);

                // if(this.state.Multiplayer === false){
                // }

                this.addYou();
                let healthBar1 = this.addHealthBar(0,0x800080,"Enemy Health Points: ",this.state.virus_health,this.state.virus_max_health, "/" + this.state.virus_max_health);
                let healthBar2 = this.addHealthBar(this.height-16,0x008000,"Your Health Points: ",this.state.player_health,this.state.player_max_health, "/" + this.state.player_max_health);
                this.healthbar12.addChild(healthBar1);
                this.healthbar22.addChild(healthBar2);
                this.AgainstVirus.addChild(this.healthbar12);
                this.AgainstVirus.addChild(this.healthbar22);

                // this.AgainstVirus.visible = true;
                break;
            case 1:
                this.app.stage.removeChild(this.AgainstVirus);
                // this.AgainstVirus.visible = false;
                
                break;
            default:

        }
    }


    addText(text,type,who){

        const styleSkill = new PIXI.TextStyle({
            dropShadow: true,
            dropShadowAlpha: 0.8,
            dropShadowBlur: 1,
            dropShadowDistance: 3,
            dropShadowColor: "#000000",
            fillGradientType: 1,
            fontSize: 45,
            fontStyle: "oblique",
            fontWeight: "bolder",
            fontFamily: "munro",
            fill: "#ffeb00"
        });

        const styleItem = new PIXI.TextStyle({
            dropShadow: true,
            dropShadowAlpha: 0.8,
            dropShadowBlur: 1,
            dropShadowDistance: 3,
            dropShadowColor: "#000000",
            fillGradientType: 1,
            fontSize: 45,
            fontStyle: "oblique",
            fontWeight: "bolder",
            fontFamily: "munro",
            fill: "#008cff"
        });

        let skillitemname = 0;
        switch(type){
            case 0:
                 skillitemname = new PIXI.Text(text,styleSkill);
                break;
            case 1:
                 skillitemname = new PIXI.Text(text,styleItem);
                break;
        }
        

        if(who != 0){
        skillitemname.x = this.width - 50 - skillitemname.width;
        }
        else
        {
            skillitemname.x = 50;
        }

        skillitemname.y = this.height/2 -100 - skillitemname.height/2 * 3;

        this.AgainstVirus.addChild(skillitemname);
        setTimeout(()=> {
            this.AgainstVirus.removeChild(skillitemname);
        },1500);
    }

    animation(target, source, health, Name, type){
        switch(target) {
            case 0:
                        if(type == 0 && source == 1){
                        this.movementTicker.add(() => this.Move(0, health, source));
                        this.movementTicker.start();
                        this.addText(Name,type,target);
                        }
                        if(target == 0 && source == 0){
                            this.healthHandler(0,health);
                            this.addText(Name,type,target);
                        }
            break;
            case 1:
                        if(type == 0 && source == 0){
                        this.movementTicker.add(() => this.Move(1, health, source));
                        this.movementTicker.start();
                        this.addText(Name,type,target);
                        }
                        if(target == 1 && source == 1){
                            this.healthHandler(1,health);
                            this.addText(Name,type,target);
                        }
                break;
            default:
                console.log("Err,animation");
        }
    }

    loadProgressHandler(loader,resource) {
        console.log("loading: " + resource.url);
        console.log("progress:" + loader.progress + "%");
    }


    healthHandler(x,newHP){
        switch(x){
            case 0:
                    this.setState({player_health: newHP}, () => {
                        this.AgainstVirus.removeChild(this.healthbar22);
                        this.healthbar22 = this.addHealthBar(this.height - 16,0x008000,"Your Health Points: ",this.state.player_health,this.state.player_max_health, "/" + this.state.player_max_health);
                        this.AgainstVirus.addChild(this.healthbar22);
                    });
                break;
            case 1: 
                 this.setState({virus_health: newHP}, () => {
                    this.AgainstVirus.removeChild(this.healthbar12);
                    this.healthbar12 = this.addHealthBar(0,0x800080,"Enemy Health Points: ",this.state.virus_health, this.state.virus_max_health ,"/" + this.state.virus_max_health);
                    this.AgainstVirus.addChild(this.healthbar12);
                    if(this.state.Multiplayer === false){                        
                        this.changeTexture(-1);
                    }
                })

                break;

            default:
                break;
        }
    }


    damageHandler = (health,x) => {
        console.log("health: " + health);
        const style = new PIXI.TextStyle({
            fill: "",
            fontSize: 45,
            fontStyle: "oblique",
            fontWeight: "bolder",
            fontFamily: "munro"
        });

        let win_lose_text = 0;

        if(x){
            this.setState(()=> {
                this.AgainstVirus.removeChild(this.healthbar12);
                this.healthbar12 = this.addHealthBar(0,0x800080,"Enemy Health Points: ",health, this.state.virus_max_health , "/" + this.state.virus_max_health);
                this.AgainstVirus.addChild(this.healthbar12);
                if(this.state.Multiplayer === false && health <= this.state.virus_max_health*0.45)
                    setTimeout(()=> {
                        this.changeTexture(0);
                    },700);
                
            });

            this.setState({
                virus_health: health,
            });
            if(health === 0){
                console.log("You win");
                this.AgainstVirus.removeChild(this.Enemy);
                win_lose_text = new PIXI.Text("You Win",style);
                win_lose_text.x = this.width/2 - win_lose_text.width/2;
                win_lose_text.y = this.height/2 - win_lose_text.height/2 * 3;
                this.AgainstVirus.addChild(win_lose_text);
            }
        }
        else{
            this.setState(() => {
                this.AgainstVirus.removeChild(this.healthbar22);
                this.healthbar22 = this.addHealthBar(this.height - 16,0x008000,"Your Health Points: ",health,this.state.player_max_health ,"/" + this.state.player_max_health);
                this.AgainstVirus.addChild(this.healthbar22);
            });

            this.setState({
                player_health: health,
            });
            if(health === 0){
                console.log("You lose");
                this.AgainstVirus.removeChild(this.You);
                win_lose_text = new PIXI.Text("You lose",style);
                win_lose_text.x = this.width/2 - win_lose_text.width/2;
                win_lose_text.y = this.height/2 - win_lose_text.height/2 * 3;
                this.AgainstVirus.addChild(win_lose_text);

            }
        }
        

    };


    addSprites()
    {
        this.sharedLoader
        .add('background',"https://firebasestorage.googleapis.com/v0/b/tic-tac-toe-revolution-covid19.appspot.com/o/background.png?alt=media&token=7ac4dc3b-dd0e-4803-82a2-946f08adf014")
        .add("PlayerGirl1", 'https://firebasestorage.googleapis.com/v0/b/tic-tac-toe-revolution-covid19.appspot.com/o/avatar1.png?alt=media&token=4fe11609-e7ca-495f-b1b8-f81a18e515a7')
        .add("PlayerBoy", 'https://firebasestorage.googleapis.com/v0/b/tic-tac-toe-revolution-covid19.appspot.com/o/avatar2.png?alt=media&token=ea7d9f24-c46a-4bd1-a6b4-14f2d129e39d')
        .add('Virus1', this.state.virus_image1)
        .add('Virus2', this.state.virus_image2)
        .add('Virus3', this.state.virus_image3)
        .add('multiplayer', "https://firebasestorage.googleapis.com/v0/b/tic-tac-toe-revolution-covid19.appspot.com/o/toscana.1.png?alt=media&token=4ad13ee5-f502-439c-9e7f-54f146c8b95a")
        .add('heartHP', 'https://firebasestorage.googleapis.com/v0/b/tic-tac-toe-revolution-covid19.appspot.com/o/hearticon.png?alt=media&token=aa6efbe1-7343-48d4-8ddb-578d3c4c6f34')

        // return true;
        
        // //let name =  this.state.currentVirus;
        // //name = name + (this.state.virusStage + 1) + "1";
        // let name = this.state.virusStage +1 + "1";
        // console.log(name);
    }

    addBackground(){
        this.sharedLoader
        .load((loader,resources)=> {
            let background = new PIXI.Sprite(resources.background.texture);
            background.width = this.width;
            background.height = this.height - 16*2; //16 is height of healthbar
            background.y += 16;
            this.AgainstVirus.addChild(background);
        }).load(() => {
            this.StartTickers();
        })
      
    }

   addEnemy(x)
   {
        switch(x) {
            case -1:
                this.Enemy.scale.set(0.26,0.26);
                this.Enemy.y = this.app.stage.height - this.Enemy.height - 32;
                this.Enemy.x = this.app.stage.width - this.Enemy.width;
                this.AgainstVirus.addChild(this.Enemy);
                break;
            case 0:
                this.sharedLoader
                .load((loader,resources) => {
                    // this.setState({
                    //     Multiplayer:false,
                    // });
                    this.Enemy = new PIXI.Sprite(resources.Virus1.texture); 
                    this.addEnemy(-1);
                })
                break;
            case "p":
                this.sharedLoader
                .load((loader,resources) => {

                    // this.Enemy = new PIXI.Sprite(resources.multiplayer.texture); 

                    // console.log(this.props.player1_health);
                    // console.log(this.props.player2_health);
                    let y = this.props.roomJoiner;
                    switch(y){
                        case true:
                            this.setState({
                                virus_health: this.props.player1_health,
                                virus_max_health: this.props.player1_max_health
                            })
                            if(this.state.xPlayer == "da")
                                this.Enemy = new PIXI.Sprite(resources.PlayerBoy.texture)
                                else
                                this.Enemy = new PIXI.Sprite(resources.PlayerGirl1.texture)

                                this.healthHandler(1,this.state.virus_health);
                                this.addEnemy(-1);
                                this.Enemy.scale.set(0.32,0.32);
                            break;
                        case false:
                            this.setState({
                                virus_health: this.props.player2_health,
                                virus_max_health: this.props.player2_max_health
                            })
                            if(this.state.oPlayer == "da")
                                this.Enemy = new PIXI.Sprite(resources.PlayerBoy.texture)
                                else
                                this.Enemy = new PIXI.Sprite(resources.PlayerGirl1.texture)
    
                                this.healthHandler(1,this.state.virus_health);
                                this.addEnemy(-1);
                                this.Enemy.scale.set(0.32,0.32);
                            break;
                    }

                    // if(this.props.roomJoiner){
                    //     this.setState({
                    //         virus_health: this.props.player1_health,
                    //         virus_max_health: this.props.player1_max_health
                    //     })
                    //     if(this.state.xPlayer == "da")
                    //         this.Enemy = new PIXI.Sprite(resources.PlayerBoy.texture)
                    //         else
                    //         this.Enemy = new PIXI.Sprite(resources.PlayerGirl1.texture)


                    //         this.healthHandler(1,this.state.virus_health);
                    //         this.addEnemy(-1);
                    //         this.Enemy.scale.set(0.36,0.36);
                    //         // this.Enemy.scale.x*=-1;
                    //         // this.Enemy.x += this.Enemy.width -12

                    // }
                    // console.log(this.props.player2_max_health)
                    // console.log(this.props.player1_max_health)

                    // if(this.props.roomCreator){
                    //     this.setState({
                    //         virus_health: this.props.player2_health,
                    //         virus_max_health: this.props.player2_max_health
                    //     })
                    //     if(this.state.oPlayer == "da")
                    //         this.Enemy = new PIXI.Sprite(resources.PlayerBoy.texture)
                    //         else
                    //         this.Enemy = new PIXI.Sprite(resources.PlayerGirl1.texture)

                    //         this.healthHandler(1,this.state.virus_health);
                    //         this.addEnemy(-1);
                    //         this.Enemy.scale.set(0.36,0.36);
                    //         // this.Enemy.scale.x*=-1;
                    //         // this.Enemy.x += this.Enemy.width - 12
                    // }



                    // console.log(this.state.virus_max_health);

                    // this.Enemy.scale.set(0.36,0.36);
                    // this.Enemy.y = this.app.stage.height - this.Enemy.height - 32;
                    // this.Enemy.x = this.app.stage.width - this.Enemy.width;
                    // this.AgainstVirus.addChild(this.Enemy);
                })
            break;
                default:
                    console.log("Err, addEnemy");
        }
        
    }


    addYou()
    {
        this.sharedLoader
         .load((loader,resources) => {

            if(this.state.image === "da")
             this.You = new PIXI.Sprite(resources.PlayerBoy.texture);
             else
             this.You = new PIXI.Sprite(resources.PlayerGirl1.texture);

             
             this.You.scale.set(0.46,0.46);
             this.You.x += 12;
             this.You.y = this.app.stage.height - this.You.height - 30;
             this.AgainstVirus.addChild(this.You);
         })
     }

    Levitate = () => {
        const levelYou = this.height - this.You.height - 32;
        const levelEnemy = this.height - this.Enemy.height - 32;
        
        this.delta += 0.01;
        const deltas = Math.sin(this.delta) * 7;

        this.Enemy.y = levelEnemy + deltas;

        this.You.y = levelYou + deltas;
    }

    resetMovementTicker =  () => {
        this.movementTicker.stop();
        this.movementTicker = new PIXI.Ticker();
        this.Enemy.x = this.width - this.Enemy.width;
        this.You.x = 12;
    }

    Move = (x,value,whichplayer) => {
        if(x !== whichplayer) {
            switch (x) {
                case -2:
                    setTimeout(() => {
                        this.Enemy.x = this.width - this.Enemy.width;
                        this.Enemy.vx = 0;
                    }, 750);
                    this.resetMovementTicker();
                    break;
                case -1:
                    setTimeout(() => {
                        this.You.x = 12;
                        if (this.state.Multiplayer === false)
                            this.changeTexture(-1);
                    }, 750);
                    this.resetMovementTicker();
                    break;
                case 0: // You move
                    if (this.collisiontest(this.You, this.Enemy)) {
                        if (this.state.Multiplayer === false)
                            this.changeTexture(1);
                        
                        this.damageHandler(value,1);
                        this.audio.play();
                        this.Move(-1, value, whichplayer);
                    }
                    this.You.vx = 8;
                    this.You.x += this.You.vx;

                    break;
                case 1: // Enemy moves
                    if (this.collisiontest(this.You, this.Enemy)) {
                        this.audio.play();
                        this.damageHandler(value,0);
                        this.Move(-2, value, whichplayer);
                    }
                    this.Enemy.vx = 8;
                    this.Enemy.x -= this.Enemy.vx;
                    break;
                default:
            }
        }
        else{
            //INSERT SELF CAST EFFECT ANIMATION HERE
            this.resetMovementTicker();
        }
    };
   
    changeTexture = (x) => {
        switch(x){
            case -1:
                this.sharedLoader
                .load((loader,resources) => {
                    setTimeout(()=> {
                        if(this.state.virus_health > this.state.virus_max_health*0.45){
                        this.Enemy.texture  = resources.Virus1.texture;
                        }
                    },200);
                 })  

                break;
            case 0:
                this.sharedLoader
                .load((loader,resources) => {
                        if(this.state.virus_health <= this.state.virus_max_health*0.45){
                            this.Enemy.texture = (resources.Virus3.texture);
                        }
                 })  
                
                break;
            case 1:
                this.sharedLoader
                .load((loader,resources) => {
                    this.Enemy.texture = (resources.Virus2.texture); 
                    setTimeout(()=>{
                        this.changeTexture(-1);    
                    },200);
                 })
                break;
                
            default:

        }
       
    }

    StartTickers = () => {
        this.floatingTicker.add(this.Levitate);
        this.floatingTicker.start();
        }

    
   

    collisiontest(r1, r2) {

        //Define the variables we'll need to calculate
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        //hit will determine whether there's a collision
        hit = false;

        //Find the center points of each sprite
        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;

        //Find the half-widths and half-heights of each sprite
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;

        //Calculate the distance vector between the sprites
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;

        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;

        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occurring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {

            //There's definitely a collision happening
            hit = true;
        } else {

            //There's no collision on the y axis
            hit = false;
        }
        } else {

        //There's no collision on the x axis
        hit = false;
        }

        //`hit` will be either `true` or `false`
        return hit;
        };
    

    render() {
        return <React.Fragment>
                <div>
                    {this.props.Multiplayer ?
                        <div style={{position: "fixed", top: "180px", left: "0" , right: "0"}} id="backgroundimage" ref={(el) => {this.ground = el}}>
                        <MultiplayerSession
                            otherPlayer_o={this.state.o_avatarImage}
                            otherPlayer_x={this.state.x_avatarImage}
                            Multiplayer={true}
                            user={this.props.user}
                            playChannel={this.props.playChannel}
                            pubnub={this.props.pubnub}
                            userX={this.props.userX}
                            userO={this.props.userO}
                            fieldPiece={this.props.fieldPiece}
                            whoIsNext={this.props.whoIsNext}
                            roomJoiner={this.props.roomJoiner}
                            roomCreator={this.props.roomCreator}
                            player1_health={this.props.player1_health}
                            player1_max_health={this.props.player1_max_health}
                            player1_ap={this.props.player1_ap}
                            player1_defense={this.props.player1_defense}
                            player2_health={this.props.player2_health}
                            player2_max_health={this.props.player2_max_health}
                            player2_ap={this.props.player2_ap}
                            player2_defense={this.props.player2_defense}
                            animation={this.animation}
                        />
                        </div>
                    :
                        <div id="backgroundimage" ref={(el) => {this.ground = el}}>
                            <SingleplayerSession
                                difficulty={this.props.difficulty}
                                virus={this.props.virus}
                                user={this.props.user}
                                animation={this.animation}
                                damageHandler={this.damageHandler}
                            />
                            <ScreenBox
                                virus={this.props.virus}
                                virus_name={this.state.virus_name}
                                virus_storyText={this.state.virus_storyText}
                                virus_image={this.state.virus_image1}
                                avatarImage={this.state.avatarImage}
                            />
                        </div>
                    }
                </div>
                </React.Fragment>;
    }


}

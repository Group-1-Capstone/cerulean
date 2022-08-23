import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'jessie');
        scene.add.existing(this);
        scene.physics.add.existing(this);

    // //ANIMS
    // scene.anims.create({
    //     key: "turn",
    //     frames: [{ key: "jessie", frame: 7 }],
    //     frameRate: 20,
    //   });
    //   scene.anims.create({
    //     key: "right",
    //     frames: scene.anims.generateFrameNumbers("jessie", { start: 3, end: 5 }),
    //     frameRate: 10,
    //     repeat: -1,
    //   });
    //   scene.anims.create({
    //     key: "left",
    //     frames: scene.anims.generateFrameNumbers("jessie", { start: 9, end: 11 }),
    //     frameRate: 10,
    //     repeat: -1,
    //   });
    //   this.setBounce(0.2);
    //   this.setCollideWorldBounds(true);

      //CURSORS
      scene.cursors = scene.input.keyboard.createCursorKeys();
      scene.keyQ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
      scene.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      scene.keyZ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
      scene.keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

      scene.events.on(Phaser.Scenes.Events.UPDATE, this.handleMovement, this);
    }

    handleMovement() {

      if (this.scene.cursors.left.isDown) {
        this.setVelocityX(-160);
        this.anims.play('left', true);
      } else if (this.scene.cursors.right.isDown) {
        this.setVelocityX(160);
        this.anims.play('right', true);
      } else {
        this.setVelocityX(0);
        this.anims.play('turn');
      }
      if (this.scene.cursors.up.isDown && this.player.body.touching.down) {
        this.setVelocityY(-330);
      }
    }
}
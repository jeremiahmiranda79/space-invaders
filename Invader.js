class Invader
{
    constructor({position})
    {        
        this.velocity = {x: 0, y: 0}
        //this.rotation = 0
        const image = new Image()
        image.src = './img/invader.png'

        image.onload = () => 
        {
            const scale = 1
            this.image = image 
            this.width = image.width * scale
            this.height = image.height * scale
            //this.position = {x: canvas.width / 2 - this.width / 2, y: canvas.height / 2}
            this.position = {x: position.x, y: position.y}
        }
    }

    draw()
    {
        //c.save()
        //c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        //c.rotate(this.rotation)
        //c.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)
        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height)
        //c.restore()        
    }
        
    update({velocity})
    {
        if(this.image)
        {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }

    shoot(invaderProjectiles)
    {
        invaderProjectiles.push(new InvaderProjectile(
            {
                position: 
                {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height
                },
                velocity: 
                {
                    x: 0,
                    y: 5
                }
            }
                
            ))
    }
}
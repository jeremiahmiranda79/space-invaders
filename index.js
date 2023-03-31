const canvas = document.querySelector('canvas')
//console.log(canvas)
const scoreEl = document.querySelector('#scoreEl')
console.log(scoreEl)
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

//playerClass

//projectileClass

//particleClass

//invaderProjectileClass

//invaderClass

//gridClass

const player = new Player()
const projectiles = []
//const invader = new Invader()
const grids = []
const invaderProjectiles = []
const particles = []
const keys = {a: {pressed: false}, d: {pressed: false}, space: {pressed: false}}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)

let game = {
    over: false,
    active: true
}
//console.log(randomInterval)

let score = 0

//background
for(let i = 0; i < 100; i++)
    {
        particles.push(new Particle(
        {
            position: 
            {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            velocity: 
            {
                x: 0,
                y: 0.3
            },
            radius: Math.random() * 2,
            color: 'white'
        }))
    }          

function createParticles({object, color, fades})
{
    for(let i = 0; i < 15; i++)
    {
        particles.push(new Particle(
        {
            position: 
            {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: 
            {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || '#BAA0DE',
            fades
        }))
    }                       
}


function animate()
{
    if(!game.active)
    {
        return
    }

   window.requestAnimationFrame(animate)
   c.fillStyle = 'black'
   c.fillRect(0, 0, canvas.width, canvas.height)
   //invader.update()
   player.update()

   particles.forEach((particle, i) => 
    {
        if(particle.position.y - particle.radius >= canvas.height)
        {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

        if(particle.opacity <= 0)
        {
            setTimeout(() => 
            {
                particles.splice(i, 1)
            }, 0)
        }
        else
        {
            particle.update()
        }
    })

    console.log(particles)

   invaderProjectiles.forEach((invaderProjectile, index) => 
    {
        if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height)
        {
            setTimeout(() => 
            {
                invaderProjectiles.splice(index, 1)
            }, 0) 
        }
        else
        {
            invaderProjectile.update()
        }

        //projectile hits player
        if(invaderProjectile.position.y + invaderProjectile.height >= player.position.y && invaderProjectile.position.x + invaderProjectile.width >= player.position.x  && invaderProjectile.position.x <= player.position.x + player.width)
        {
            console.log('you lose!')

            setTimeout(() =>{
                invaderProjectiles.splice(index, 1)
                player.opacity = 0
                game.over = true
            }, 0)

            setTimeout(() =>{
                game.active = false
            }, 2000)

            createParticles(
                {
                    object: player,
                    color: 'white',
                    fades: true
                }
            )
        }

        //console.log(invaderProjectiles)
    })

   projectiles.forEach((projectile, index) => 
    {
        if(projectile.position.y + projectile.radius <= 0)
        {
            setTimeout(() => 
            {
                projectiles.splice(index, 1)
            }, 0)           
        }
        else
        {
            projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => 
    {
        grid.update()
        //spawn projectiles
        if(frames % 100 === 0 && grid.invaders.length > 0)
        {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        }

        grid.invaders.forEach((invader, i) => 
        {
            invader.update({velocity: grid.velocity})

            //projectile hits enemy
            projectiles.forEach((projectile, j) => 
            {
                if (projectile.position.y - projectile.radius <= 
                    invader.position.y + invader.height && 
                    projectile.position.x + projectile.radius >= 
                    invader.position.x && 
                    projectile.position.x - projectile.radius <= 
                    invader.position.x + invader.width && 
                    projectile.position.y + projectile.radius >= 
                    invader.position.y
                    ) {
                        setTimeout(() =>{
                            const invaderFound = grid.invaders.find(
                                (invader2) => invader2 === invader
                            )
                            const projectileFound = projectiles.find(
                                (projectile2) => projectile2 === projectile
                            )
                                //remove invader and projectile
                                console.log('remove')
                            if(invaderFound && projectileFound){
                                score += 100
                                console.log(score)
                                scoreEl.innerHTML = score

                                createParticles({
                                    object: invader,
                                    fades: true
                                })
                                    grid.invaders.splice(i, 1)
                                    projectiles.splice(j, 1)

                                    if(grid.invaders.length > 0)
                                    {
                                        const firstInvader = grid.invaders[0]
                                        const lastInvader = grid.invaders[grid.invaders.length - 1]

                                        grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width

                                        grid.position.x = firstInvader.position.x
                                    }
                                    else
                                    {
                                        grids.splice(gridIndex, 1)
                                    }
                                }
                                
                            }, 0)
                        }
                    })
            })
    })

   if(keys.a.pressed && player.position.x >= 0)
   {
        player.velocity.x = -5
        player.rotation = -0.15
   }
   else if(keys.d.pressed && player.position.x + player.width <= canvas.width)
   {
        player.velocity.x = 5
        player.rotation = 0.15
   }
   else
   {
        player.velocity.x = 0
        player.rotation = 0
   }

   //console.log(frames)

   if(frames % randomInterval === 0)
   {
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500 + 500)
        frames = 0
        //console.log(randomInterval)
   }

   frames++
}

animate()

window.addEventListener('keydown', ({key}) => 
{
    if(game.over)
    {
        return
    }
    //console.log(key)
    switch(key)
    {
        case 'a':
            //console.log('left')           
            keys.a.pressed = true
            break
        case 'd':
            //console.log('right')
            keys.d.pressed = true
            break
        case ' ':
            //console.log('space')
            projectiles.push(new Projectile({position: {x: player.position.x + player.width / 2, y: player.position.y}, velocity: {x: 0, y: -10}}))
            //console.log(projectiles)
            break
    }
})

window.addEventListener('keyup', ({key}) => 
{
    //console.log(key)
    switch(key)
    {
        case 'a':
            //console.log('left')           
            keys.a.pressed = false
            break
        case 'd':
            //console.log('right')            
            keys.d.pressed = false
            break
        case ' ':
            //console.log('space')
            break
    }
})
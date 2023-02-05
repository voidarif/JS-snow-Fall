const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

var ministarsColor

function randomIntFromRange(max, min) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors){
	return colors[Math.floor(Math.random() * colors.length)]
}

function addAlpha (color, opacity) {
    // coerce values so ti is between 0 and 1.
    var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}


	function Star(x, y, radius, color){
		this.x = x 
		this.y = y 
		this.radius =radius
		this.color = color
		this.velocity = {
			x: Math.random() - 0.5 * 10 + 3,
			y: 0
		}
		this.gravity = 1 
		this.friction = 0.8

		this.draw = function(){
			c.save()
			c.beginPath()
			c.fillStyle = this.color
			c.arc(this.x, this.y, this.radius, Math.PI * 2, false)
			c.shadowColor = this.color
			c.shadowBlur = 40
			c.fill()
			c.restore()
		}

		this.update = function(){
			//adding Gravity function and limiting the area y axis
			if(this.y + this.radius + this.velocity.y > canvas.height -groundHeight /*|| this.y - this.radius <= 0*/){
				this.velocity.y = -this.velocity.y * this.friction
				this.shatter()
			}else{
				this.velocity.y += this.gravity
			}

			//adding Gravity function and limiting the area x axis
			if(this.x + this.radius + this.velocity.x > canvas.width || this.x - this.radius <= 0){
				this.velocity.x = -this.velocity.x * this.friction
				this.shatter()
			}

			this.y += this.velocity.y 
			this.x += this.velocity.x 
			this.draw()
		}

		this.shatter = function(){
			this.radius -= 3
			for (var i = 0; i < 10; i++) {
				ministars.push(new MiniStar(this.x, this.y, 2))
			}
		}
}


//function for ministars and explode
function MiniStar(x, y, radius, color){
		Star.call(this, x, y, radius, color)
		this.velocity = {
			x: randomIntFromRange(-5, 5),
			y: randomIntFromRange(-15, 15)
		}
		this.gravity = 0.2 
		this.friction = 0.8
		this.ttl = 50
		this.opacity = 1 

		

		this.draw = function(){
			c.save()
			c.beginPath()
			c.arc(this.x, this.y, this.radius, Math.PI * 2, false)
			c.fillStyle = addAlpha('#FFFF00', this.opacity)
			c.shadowColor = addAlpha('#FFFF00', this.opacity)
			c.shadowBlur = 40
			c.fill()
			c.closePath()
			c.restore()
		}

		this.update = function(){
			this.draw()
			//adding Gravity function and limiting the area y axis
			if(this.y + this.radius + this.velocity.y > canvas.height - groundHeight || this.y - this.radius <= 0){
				this.velocity.y = -this.velocity.y * this.friction
			}else{
				this.velocity.y += this.gravity
			}

			this.x += this.velocity.x 
			this.y += this.velocity.y 
			this.ttl -=1
			this.opacity -= 1 / this.ttl
		}
}

//function to create Mountain
function createMoutainRange(mountainAmount, height, color){
	for (var i = 0; i < mountainAmount; i++) {
	const mountainWidth = canvas.width / mountainAmount
		c.beginPath()
		c.moveTo(i * mountainWidth, canvas.height)
		c.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height )
		c.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height)
		c.lineTo(i * mountainWidth - 325, canvas.height )
		c.fillStyle = color
		c.fill()
		c.closePath()
		
	}
}

function moon() {
		c.save()
		c.beginPath()
		c.fillStyle = 'white'
		c.arc(canvas.width / 4.6, 100, 50, Math.PI * 2, false)
		c.shadowColor =  '#e3eaef'
		c.shadowBlur = 50
		c.fill()
		c.restore()
}

function FallenStar(x, y, radius, velocity) {
	this.x = x 
	this.y = y 
	this.radius = radius
	this.velocity = velocity

	this.draw = function () {
			c.save()
			c.beginPath()
			c.arc(this.x, this.y, this.radius, Math.PI * 2, false)
			c.fillStyle = randomColor(colorArray)
			c.shadowColor = 'white'
			c.shadowBlur = 20
			c.fill()
			c.closePath()
			c.restore()
	}

	this.update = function(){
		this.draw()
		this.x += this.velocity
		
	}
}
 //new FallenStar(100,100, 6, 10)

const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height)
backgroundGradient.addColorStop(0, '#171e26')
backgroundGradient.addColorStop(1, '#3f586b')


var stars = []
var ministars = []
var backgroundStars = []
var fallenstars = []
var groundHeight = 100
var ticker = 0

var colorArray = [
	'#04D939',
	'yellow',
	'white',
	'#aaff00',
	'#2acaea'
	]
var starColor = [
	'yellow',
	'white',
]

/*for (var i = 0; i < 1; i++) {
	stars.push(new Star(canvas.width / 2, 100, 40, 'yellow'))
}*/

for (var i = 0; i < 150; i++) {
	const x = Math.random() * canvas.width
	const y = Math.random() * canvas.height
	const radius = Math.random() * 3 + 1 
	backgroundStars.push(new Star(x, y, radius, randomColor(starColor)))
}

function animate() {
	requestAnimationFrame(animate)
	c.fillStyle = backgroundGradient
	c.fillRect(0, 0, canvas.width, canvas.height)

	//drawing background Star
	for (var i = 0; i < backgroundStars.length; i++) {
		backgroundStars[i].draw()
	}

	//drawing fallenStar
	fallenstars.forEach((fallenstar)=>{
		fallenstar.update()
	})

	moon()
	
	//drawing Mountain
	createMoutainRange(1, canvas.height - 50, '#384551')
	createMoutainRange(2, canvas.height - 100, '#2b3843')
	createMoutainRange(3, canvas.height - 300, '#26333e')

	//ground Heigh
	c.fillStyle = '#182028'
	c.fillRect(0,canvas.height - groundHeight,canvas.width, groundHeight)

	//drawing the Main star
	stars.forEach((star, index)=>{
		star.update()
		if (star.radius <= 1) {
			stars.splice(index,1)
		}
	})

	//drawing the mini star
	ministars.forEach((ministar, index)=>{
		ministar.update()
		if(ministar.ttl == 0){
			ministars.splice(index, 1)
		}
	})

	

	ticker++

	//creating star after 30 fps
	if(ticker % 30 == 0){
		const radius = 12
		const x = Math.max(radius, Math.random() * canvas.width - radius )
		stars.push(new Star(x, -100, radius, randomColor(colorArray)))
		console.log(stars)
	}

	//changing ministar color after 15 fps
	if(ticker & 15 == 0){
		ministarsColor = randomColor(colorArray)
		console.log(ministar.color)
	}

	//falling star
	if(ticker % 120 == 0){
		let x = Math.random() * canvas.width 
		let y = Math.random() * 150
		let radius = Math.random() * 5 + 3
		let velocity = Math.random() * 20 + 10
		fallenstars.push(new FallenStar(-x, y, radius, velocity))
	}

}
animate()

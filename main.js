//1.初始化
let oC=document.querySelector('#canvas')
let gd=oC.getContext('2d')
let eraserEnabled=false
let pen=document.querySelector('#pen')
let eraser=document.querySelector('#eraser')
let color = document.getElementById("color")
let thickness = document.getElementById("thickness")
let actions = document.getElementById("actions")



//3.用户操作
painting(oC);
color.addEventListener('click',changeColor)
thickness.addEventListener('click', changeThickness)
actions.addEventListener('click', (e) => {
  //console.log(e.target.parentNode.id)
    if (e.target.tagName === 'li') {
      takeAction(e.target.id)
    } else if (e.target.tagName === 'ul') {
      console.log(e.target.children[0].id)
      takeAction(e.target.children[0].id)
    } else{
      console.log(e.target.parentNode.id)
      takeAction(e.target.parentNode.id)
    }
  })

//绘制
function painting(canvas) {
    gd.strokeStyle = "black"
    gd.fillStyle = "black"
    gd.lineWidth = 2
    gd.radius = 1
    let isUsing = false        //是否正在使用
    let previousPoint = {}
    //特性检测
    if (document.body.ontouchstart !== undefined) {
      //触屏设备
      canvas.addEventListener('touchstart', touchStart.bind(null, previousPoint))
      canvas.addEventListener('touchmove', touchMove.bind(null, previousPoint))
      canvas.addEventListener('touchcancel', touchCancel)
    }
    else {
      //PC设备
      canvas.onmousedown = (e) => {
        isUsing = true
        let x = e.clientX
        let y = e.clientY
        if (!eraserEnabled) {
          previousPoint = { x: x, y: y }
          drawPoint(x, y, gd.radius)
        }
        else {
          gd.clearRect(x - 5, y - 5, 10, 10)
        }
        document.onmousemove = (e) => {
          if (isUsing) {
            let x = e.clientX
            let y = e.clientY
            let newPoint = { x: x, y: y }
            if (!eraserEnabled) {
              drawPoint(x, y, gd.radius)
              drawLine(previousPoint.x, previousPoint.y, newPoint.x, newPoint.y)
              previousPoint = newPoint
            }
            else {
              gd.clearRect(x - 5, y - 5, 10, 10)
            }
          }
        }
        document.onmouseup = () => {
          isUsing = false
          document.onmouseover=null
          document.onmouseup=null
        }
      }
     
    }
  }
  function touchStart(point, e) {
    e.preventDefault()
    let x, y
    for (let touch of e.changedTouches) {
      x = Math.floor(touch.clientX)
      y = Math.floor(touch.clientY)
      if (!eraserEnabled) {
        point[touch.identifier] = { x: x, y: y }
        drawPoint(x, y, gd.radius)
      } else {
        gd.clearRect(x - 5, y - 5, 10, 10)
      }
    }
  }
  function touchMove(originalPoint, e) {
    e.preventDefault()
    let x, y, newPoint = {}
    for (let touch of e.changedTouches) {
      x = Math.floor(touch.clientX)
      y = Math.floor(touch.clientY)
      if (!eraserEnabled) {
        newPoint[touch.identifier] = { x: x, y: y }
        drawPoint(x, y, gd.radius)           //需要添加此函数才不会使得画出来的线在lineWidth变大时不完整
        drawLine(originalPoint[touch.identifier].x, originalPoint[touch.identifier].y, newPoint[touch.identifier].x, newPoint[touch.identifier].y)
        originalPoint[touch.identifier] = newPoint[touch.identifier]
      }
      else {
        gd.clearRect(x - 8, y - 8, 16, 16)
      }
    }
  }
  function touchCancel() {
    alert("Oops! 是不是你的第六个小指头打断了画画~ !!(•'╻'•)꒳ᵒ꒳ᵎᵎᵎ \n\n乖，听话，最多只能用五个指头哦！")
  }
//选择画笔颜色
function changeColor(e){
    let selectedColor=e.target.id
    gd.strokeStyle=selectedColor
    gd.fillStyle=selectedColor
    witchActived(selectedColor,'color');
}
//选择画笔大小
function changeThickness(e) {
    let selectedThickness = e.target.id
    if (selectedThickness === 'thin') {
      gd.lineWidth = 2
      gd.radius = 1
    } else if (selectedThickness === 'middle') {
      gd.lineWidth = 6
      gd.radius = 3
    } else if (selectedThickness === 'thick') {
      gd.lineWidth = 10
      gd.radius = 5
    }
    witchActived(selectedThickness, 'thickness')
  }
function witchActived(target,parentID) {
   let parentNode
   if(parentID == 'color') {
       parentNode = color
   }else if(parentID == 'thickness') {
       parentNode = thickness
   }
   Array.from(parentNode.children).forEach(item=>{
       if(target === item.id) {
           item.className='active'
       }else if(target !== item.id){
           item.className=''
       }
   })
}
function drawPoint(x,y,radius) {
    gd.beginPath();
    gd.arc(x,y,radius,0,Math.PI*2,false)
    gd.fill()
}
/* 画轨迹（线条） */
function drawLine(x1, y1, x2, y2) {
    // 解决IOS中获取不到gd设置的问题
    if (gd.lineWidth === 1) {
      gd.lineWidth = 2
      gd.radius = 1
    }
    gd.beginPath()
    gd.moveTo(x1, y1)
    gd.lineTo(x2, y2)
    gd.stroke()
  }
/* 选择哪个动作 */

function takeAction(element) {
    console.log(element)
    if (element === 'pen') {
      eraserEnabled = false
      pen.classList.add("active")
      eraser.classList.remove("active")
      color.className = "active"
      thickness.className = "active"
    } else if (element === 'eraser') {
      eraserEnabled = true
      pen.classList.remove("active")
      eraser.classList.add("active")
      color.className = "remove"
      thickness.className = "remove"
    } else if (element === 'clearall') {
      gd.clearRect(0, 0, oC.width, oC.height)    //清屏
      eraserEnabled = false
      pen.classList.add("active")
      eraser.classList.remove("active")
      color.className = "active"
      thickness.className = "active"
    } else if (element === 'save') {
      let a = document.createElement("a")
      a.href = oC.toDataURL()           //获得图片地址
      a.target = "_blank"
      a.download = "image.png"
      a.click()
    }
  }
//2. 设置画布自动布满视口
function autoSetCanvasSize(canvas){
    setCanvasSize(canvas)
    window.onresize = () => {
      setCanvasSize(canvas)
    }
    //设置画布宽高
    function setCanvasSize(canvas) {
      let pageWidth = document.documentElement.clientWidth
      let pageHeight = document.documentElement.clientHeight
      canvas.width = pageWidth
      canvas.height = pageHeight
    }
}
autoSetCanvasSize(oC)


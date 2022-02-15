import * as THREE from 'three'

export default (el, { ctx }) => {
  let container
  let camera, scene, renderer
  const windowHalfX = window.innerWidth / 2
  let targetRotation = 0
  let targetRotationOnPointerDown = 0

  let pointerX = 0
  let pointerXOnPointerDown = 0

  const init = () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 2, 400)
    camera.position.set(100, 100, 150)
    camera.lookAt(100, 100, 0)

    // camera = new THREE.ArrayCamera(cameras)
    // camera.position.z = 10
    scene.add(camera)

    const axesHelper = new THREE.AxesHelper(10000)
    scene.add(axesHelper)
    const map = new THREE.TextureLoader().load('/茴香.png')
    // const material = new THREE.SpriteMaterial({ map: map })

    // const sprite = new THREE.Sprite(material)
    // sprite.position.set(10, 10, 10)

    // sprite.scale.set(120, 120, 1)

    // scene.add(sprite)

    const geometry = new THREE.BoxGeometry(50, 50, 0)
    const material = new THREE.MeshBasicMaterial({ map, transparent: true })
    const cube = new THREE.Mesh(geometry, material)

    cube.position.set(70, 10, 10)
    cube.rotation.set(0, 0, 0)
    cube.scale.set(1, 1, 1)
    scene.add(cube)

    const cube2 = cube.clone()
    cube.position.set(100, 10, 40)
    scene.add(cube2)

    const geometry1 = new THREE.BoxGeometry(110, 230, 0)
    const map1 = new THREE.TextureLoader().load('/s5d89e83508c44.png')
    const material1 = new THREE.MeshBasicMaterial({ map: map1, transparent: true })
    const cube1 = new THREE.Mesh(geometry1, material1)
    cube1.position.set(170, 120, 10)
    cube1.rotation.set(0, 0, 0)
    cube1.scale.set(1, 1, 1)
    scene.add(cube1)

    const light = new THREE.PointLight(0xffffff, 0.8)
    camera.add(light)
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    //   stats = new Stats()
    //   container.appendChild(stats.dom)

    container.style.touchAction = 'none'
    container.addEventListener('pointerdown', onPointerDown)
  }

  function onPointerDown (event) {
    if (event.isPrimary === false) return

    pointerXOnPointerDown = event.clientX - windowHalfX
    targetRotationOnPointerDown = targetRotation

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }

  function onPointerMove (event) {
    if (event.isPrimary === false) return

    pointerX = event.clientX - windowHalfX

    targetRotation = targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.02
  }

  function onPointerUp (event) {
    if (event.isPrimary === false) return

    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', onPointerUp)
  }

  function animate () {
    window.requestAnimationFrame(animate)
    render()
    //   stats.update()
  }

  function render () {
    // group.rotation.y += (targetRotation - group.rotation.y) * 0.05
    camera.position.set(100 + targetRotation * 4, 100, 350)
    renderer.render(scene, camera)
  }

  init()
  animate()
}

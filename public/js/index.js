function onButtonClick(e) {
    e.preventDefault();
    console.log('in on button click')
    console.log(e.target.name, e.target.id, e.target.value)
}
function openModal() {
    document.getElementById('myModal').style.display = "block";
    document.getElementById('coverphoto').style.opacity = "0.3";
}

function closeModal(event) {
    var modal = document.getElementById('myModal');
    if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById('coverphoto').style.opacity = "1"; 
    }
}

function openModal2() {
    document.getElementById('myModal2').style.display = "block";
    document.getElementById('userprofpic').style.opacity = "0.3"; 
}

function closeModal2(event) {
    var modal = document.getElementById('myModal2');
    if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById('userprofpic').style.opacity = "1"; 
    }
}
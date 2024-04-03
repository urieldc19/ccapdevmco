document.getElementById('passwordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
  
    // Fetch form values
    var currentPassword = document.getElementById('currentPassword').value;
    var newPassword = document.getElementById('newPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
  
    // Perform client-side validation
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    } else if (newPassword == currentPassword){
        alert('New password and current password should not match.')
        return;
    } else {
        alert('You have succesfully changed your password.')
    }

    window.location.href = '/';
  });
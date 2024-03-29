// enhanced-auth-api\frontend\profile.js

const profileVisibilityPublic = document.getElementById('profile-visibility-public');
const profileVisibilityPrivate = document.getElementById('profile-visibility-private');
const editProfileLink = document.getElementById('edit-profile-link');
const signOutButton = document.getElementById('sign-out-button');

// Get the user ID from the URL or session storage
const userId = new URLSearchParams(window.location.search).get('userId') || sessionStorage.getItem('userId');

// Function to fetch the user's profile data
async function fetchUserProfile() {
  try {
    const response = await fetch(`/profiles/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Set the authentication headers
    setAuthHeaders(response.headers);

    const data = await response.json();

    // Update the profile details on the page
    document.getElementById('name').textContent = data.name;
    document.getElementById('bio').textContent = data.bio;
    document.getElementById('phone').textContent = data.phone;
    document.getElementById('email').textContent = data.email;

    // Set the profile visibility radio buttons based on the user's preference
    if (data.isProfilePublic) {
      profileVisibilityPublic.checked = true;
    } else {
      profileVisibilityPrivate.checked = true;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
}

// Function to update the user's profile visibility
async function updateProfileVisibility(isPublic) {
  try {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    // Set the authentication headers
    setAuthHeaders(headers);

    const response = await fetch(`/profiles/${userId}/profile-visibility`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ isProfilePublic: isPublic }),
    });

    if (response.ok) {
      console.log('Profile visibility updated successfully');
    } else {
      console.error('Error updating profile visibility:', response.status);
    }
  } catch (error) {
    console.error('Error updating profile visibility:', error);
  }
}

// Function to get the JWT from storage
function getJWT() {
  return localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
}

// Function to set the authentication headers
function setAuthHeaders(headers) {
  const jwt = getJWT();
  if (jwt) {
    headers.set('Authorization', `Bearer ${jwt}`);
  }
}

// Event listeners
profileVisibilityPublic.addEventListener('change', () => {
  updateProfileVisibility(true);
});

profileVisibilityPrivate.addEventListener('change', () => {
  updateProfileVisibility(false);
});

editProfileLink.addEventListener('click', (event) => {
  event.preventDefault();
  window.location.href = `/edit-profile.html?userId=${userId}`;
});

signOutButton.addEventListener('click', () => {
  // Clear any user data from local storage or session storage
  localStorage.removeItem('jwt');
  sessionStorage.removeItem('jwt');
  // Redirect the user to the login page
  window.location.href = '/login.html';
});

// Fetch the user's profile data when the page loads
fetchUserProfile();

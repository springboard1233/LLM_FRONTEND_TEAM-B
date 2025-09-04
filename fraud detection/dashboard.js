// ===== USER INFO LOADING =====
window.onload = function () {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    window.location.href = "index.html"; // redirect if not logged in
    return;
  }


  // Set username & email
  document.getElementById("dropdownName").innerText = user.username;
  document.getElementById("dropdownEmail").innerText = user.email;

    // Show in profile header
  document.getElementById("profileName").innerText = user.name || "No Name";
  document.getElementById("profileEmail").innerText = user.email;

  // Load saved profile picture
  const savedPic = localStorage.getItem("profilePic");
  if (savedPic) {
    document.getElementById("profilePic").src = savedPic;
    document.getElementById("dropdownPic").src = savedPic;
  }
};

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// ===== PROFILE DROPDOWN TOGGLE =====
function toggleProfileMenu() {
  const dropdown = document.getElementById("profileDropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Close dropdown when clicking outside
window.addEventListener("click", function (e) {
  if (!e.target.closest(".profile-menu")) {
    document.getElementById("profileDropdown").style.display = "none";
  }
});


// ===== PROFILE UPLOAD + CROPPER =====
const profileUpload = document.getElementById("profileUpload");
let cropper;

profileUpload.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    // Create cropping modal
    const modal = document.createElement("div");
    modal.id = "cropModal";
    modal.style.cssText = `
      position: fixed; top:0; left:0; width:100%; height:100%;
      background: rgba(0,0,0,0.8); display:flex;
      justify-content:center; align-items:center; z-index:2000;
    `;
    modal.innerHTML = `
      <div style="background:#fff; padding:20px; border-radius:10px; max-width:450px;">
        <h3 style="margin-bottom:10px; text-align:center;">Crop your profile</h3>
        <img id="cropImage" src="${event.target.result}" style="max-width:100%; display:block; margin:auto;">
        <div style="margin-top:15px; text-align:center;">
          <button id="saveCrop" style="margin-right:10px;">Save</button>
          <button onclick="document.getElementById('cropModal').remove()">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const image = document.getElementById("cropImage");
    cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      autoCropArea: 1
    });

    // Save cropped image
    document.getElementById("saveCrop").onclick = function () {
      const canvas = cropper.getCroppedCanvas({ width: 200, height: 200 });
      const croppedImg = canvas.toDataURL("image/png");

      // Save to localStorage
      localStorage.setItem("profilePic", croppedImg);

      // Update UI
      document.getElementById("profilePic").src = croppedImg;
      document.getElementById("dropdownPic").src = croppedImg;

      // Close modal
      document.getElementById("cropModal").remove();
    };
  };
  reader.readAsDataURL(file);
});

// ===== CSV UPLOAD =====
function uploadFile() {
  const fileInput = document.getElementById("fileUpload");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a CSV file.");
    return;
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      const data = results.data;
      loadTransactions(data);
      showAnalytics(data);
    },
  });
}

// ===== LOAD TRANSACTIONS IN TABLE =====
function loadTransactions(data) {
  const tableBody = document.getElementById("transactionTable");
  tableBody.innerHTML = "";
  data.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.User || "N/A"}</td>
      <td>$${row.Amount || 0}</td>
      <td>${row.Status || "Pending"}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// ===== ANALYTICS =====
function showAnalytics(data) {
  let total = data.length;
  let fraud = data.filter((d) => d.Status && d.Status.toLowerCase() === "fraud").length;
  let legit = total - fraud;
  let avg = data.reduce((acc, d) => acc + (parseFloat(d.Amount) || 0), 0) / total;

  document.getElementById("totalTx").innerText = total;
  document.getElementById("fraudStats").innerText = `${fraud} vs ${legit}`;
  document.getElementById("avgTx").innerText = `$${avg.toFixed(2)}`;

  // Chart
  const ctx = document.getElementById("fraudChart").getContext("2d");
  if (window.fraudChartInstance) {
    window.fraudChartInstance.destroy();
  }
  window.fraudChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Fraud", "Legitimate"],
      datasets: [
        {
          data: [fraud, legit],
          backgroundColor: ["#ff4b5c", "#4caf50"],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}
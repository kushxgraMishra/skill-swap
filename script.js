
const skills = [
    {
        id: 1,
        name: "Aarav Sharma",
        initials: "AS",
        teach: "Java Programming",
        learn: "UI/UX Design",
        category: "Technology",
        level: "Intermediate",
        color: "purple"
    },
    {
        id: 2,
        name: "Simran Kapoor",
        initials: "SK",
        teach: "UI/UX Design",
        learn: "Web Development",
        category: "Design",
        level: "Advanced",
        color: "pink"
    },
    {
        id: 3,
        name: "Rohan Verma",
        initials: "RV",
        teach: "Web Development",
        learn: "Video Editing",
        category: "Technology",
        level: "Intermediate",
        color: "blue"
    },
    {
        id: 4,
        name: "Ananya Singh",
        initials: "AS",
        teach: "Guitar",
        learn: "Photography",
        category: "Music",
        level: "Beginner",
        color: "orange"
    },
    {
        id: 5,
        name: "Kabir Mehta",
        initials: "KM",
        teach: "Photography",
        learn: "Java Programming",
        category: "Design",
        level: "Advanced",
        color: "green"
    },
    {
        id: 6,
        name: "Meera Joshi",
        initials: "MJ",
        teach: "Spanish",
        learn: "Public Speaking",
        category: "Language",
        level: "Intermediate",
        color: "pink"
    }
];

const skillsContainer = document.getElementById("skillsContainer");
const emptyState = document.getElementById("emptyState");

function displaySkills(skillList) {
    skillsContainer.innerHTML = "";

    emptyState.classList.toggle("d-none", skillList.length !== 0);

    skillList.forEach(function (skill) {
        const card = document.createElement("div");

        card.className = "col-md-6 col-lg-4";

        card.innerHTML = `
            <div class="skill-card h-100">
                <div class="d-flex align-items-center gap-3 mb-4">
                    <div class="avatar avatar-${skill.color}">
                        ${skill.initials}
                    </div>

                    <div>
                        <h6 class="mb-1">${skill.name}</h6>
                        <span class="small text-secondary">
                            ${skill.level} level
                        </span>
                    </div>
                </div>

                <div class="skill-detail">
                    <span class="detail-label">CAN TEACH</span>
                    <h5>${skill.teach}</h5>
                </div>

                <div class="skill-detail learn-detail mt-3">
                    <span class="detail-label">WANTS TO LEARN</span>
                    <h6>${skill.learn}</h6>
                </div>

                <div class="d-flex justify-content-between
                            align-items-center mt-4 gap-2">
                    <span class="category-badge">
                        ${skill.category}
                    </span>

                    <button
                        class="btn btn-dark rounded-pill px-3 swap-btn"
                        data-id="${skill.id}"
                        type="button">
                        Request swap &rarr;
                    </button>
                </div>
            </div>
        `;

        skillsContainer.appendChild(card);
    });
}

displaySkills(skills);

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

function filterSkills() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filteredSkills = skills.filter(function (skill) {
        const searchableText = (
            skill.name + " " +
            skill.teach + " " +
            skill.learn + " " +
            skill.category
        ).toLowerCase();

        const matchesSearch = searchableText.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            skill.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displaySkills(filteredSkills);
}

searchInput.addEventListener("input", filterSkills);
categoryFilter.addEventListener("change", filterSkills);

const swapModalElement = document.getElementById("swapModal");
const swapModal = new bootstrap.Modal(swapModalElement);

const swapForm = document.getElementById("swapForm");
const swapPartnerName = document.getElementById("swapPartnerName");
const offeredSkill = document.getElementById("offeredSkill");
const swapMessage = document.getElementById("swapMessage");

const successToastElement = document.getElementById("successToast");
const successToast = new bootstrap.Toast(successToastElement);

let selectedPartner = null;

skillsContainer.addEventListener("click", function (event) {
    const button = event.target.closest(".swap-btn");

    if (!button) {
        return;
    }

    const partnerId = Number(button.dataset.id);

    selectedPartner = skills.find(function (skill) {
        return skill.id === partnerId;
    });

    if (!selectedPartner) {
        return;
    }

    swapPartnerName.textContent = selectedPartner.name;
    swapForm.reset();

    swapModal.show();
});

swapForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!swapForm.checkValidity()) {
        swapForm.reportValidity();
        return;
    }

    if (!selectedPartner) {
        return;
    }

    const request = {
        id: Date.now(),
        partnerId: selectedPartner.id,
        partnerName: selectedPartner.name,
        requestedSkill: selectedPartner.teach,
        offeredSkill: offeredSkill.value.trim(),
        message: swapMessage.value.trim(),
        status: "Pending",
        date: new Date().toLocaleDateString()
    };

    const savedRequests = JSON.parse(
        localStorage.getItem("skillSwapRequests") || "[]"
    );

    savedRequests.push(request);

    localStorage.setItem(
        "skillSwapRequests",
        JSON.stringify(savedRequests)
    );

    swapModal.hide();
    successToast.show();
    displayRequests();

    swapForm.reset();
    selectedPartner = null;
});

const requestsContainer = document.getElementById("requestsContainer");
const noRequests = document.getElementById("noRequests");

function displayRequests() {
    const savedRequests = JSON.parse(
        localStorage.getItem("skillSwapRequests") || "[]"
    );

    requestsContainer.innerHTML = "";

    noRequests.classList.toggle("d-none", savedRequests.length > 0);

    savedRequests.slice().reverse().forEach(function (request) {
        const card = document.createElement("div");

        card.className = "col-md-6 col-lg-4";

        card.innerHTML = `
            <div class="skill-card h-100">
                <div class="d-flex justify-content-between
                            align-items-start gap-2 mb-3">
                    <span class="category-badge">Skill exchange</span>
                    <span class="badge rounded-pill text-bg-warning">
                        ${request.status}
                    </span>
                </div>

                <h5 class="mb-1">${request.partnerName}</h5>

                <p class="small text-secondary mb-4">
                    Requested on ${request.date}
                </p>

                <div class="skill-detail">
                    <span class="detail-label">YOU WANT TO LEARN</span>
                    <h6>${request.requestedSkill}</h6>
                </div>

                <div class="skill-detail learn-detail mt-3">
                    <span class="detail-label">YOU OFFER</span>
                    <h6>${request.offeredSkill}</h6>
                </div>

                <p class="small text-secondary mt-3 mb-0">
                    ${request.message || "No message added."}
                </p>
            </div>
        `;

        requestsContainer.appendChild(card);
    });
}

displayRequests();


const myProfileForm = document.getElementById("myProfileForm");

const profileName = document.getElementById("profileName");
const profileTeach = document.getElementById("profileTeach");
const profileLearn = document.getElementById("profileLearn");
const profileCategory = document.getElementById("profileCategory");
const profileLevel = document.getElementById("profileLevel");

const savedProfileKey = "mySkillSwapProfile";

function updateProfilePreview(profile) {
    document.getElementById("previewName").textContent =
        profile.name || "Your name";

    document.getElementById("profileAvatar").textContent =
        profile.name
            ? getInitials(profile.name)
            : "ME";

    document.getElementById("previewLevel").textContent =
        profile.level || "Your skill level";

    document.getElementById("previewTeach").textContent =
        profile.teach || "Your skills will appear here.";

    document.getElementById("previewLearn").textContent =
        profile.learn || "Your learning goals will appear here.";
}

function loadMyProfile() {
    const savedProfile = localStorage.getItem(savedProfileKey);

    if (!savedProfile) {
        updateProfilePreview({});
        return;
    }

    try {
        const profile = JSON.parse(savedProfile);

        profileName.value = profile.name || "";
        profileTeach.value = profile.teach || "";
        profileLearn.value = profile.learn || "";
        profileCategory.value = profile.category || "";
        profileLevel.value = profile.level || "Beginner";

        updateProfilePreview(profile);
    } catch (error) {
        console.error("Could not load profile:", error);
    }
}

myProfileForm.addEventListener("input", function () {
    updateProfilePreview({
        name: profileName.value.trim(),
        teach: profileTeach.value.trim(),
        learn: profileLearn.value.trim(),
        level: profileLevel.value
    });
});

myProfileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!myProfileForm.checkValidity()) {
        myProfileForm.reportValidity();
        return;
    }

    const profile = {
        name: profileName.value.trim(),
        teach: profileTeach.value.trim(),
        learn: profileLearn.value.trim(),
        category: profileCategory.value,
        level: profileLevel.value
    };

    localStorage.setItem(savedProfileKey, JSON.stringify(profile));

    updateProfilePreview(profile);

    alert("Your profile has been saved successfully!");
});

function getInitials(name) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(function (part) {
            return part.charAt(0).toUpperCase();
        })
        .join("");
}

loadMyProfile();
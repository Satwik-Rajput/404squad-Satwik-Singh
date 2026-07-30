/**
 * Auth & User Profile State Manager
 */

export class AuthManager {
  constructor() {
    this.user = JSON.parse(localStorage.getItem("skill_bridge_user")) || null;
    this.profile = JSON.parse(localStorage.getItem("skill_bridge_profile")) || {
      name: "Guest Client",
      email: "guest@skillbridge.in",
      location: "Andheri West, Mumbai",
      bio: "Looking for top verified local professionals.",
      isIdVerified: true,
    };
  }

  getUser() {
    return this.user;
  }

  getProfile() {
    return this.profile;
  }

  getTrustScore() {
    let score = 0;
    if (this.profile.name && this.profile.location) score += 25;
    if (this.profile.bio && this.profile.bio.length > 5) score += 25;
    if (this.profile.email) score += 25;
    if (this.profile.isIdVerified) score += 25;
    return score;
  }

  login(name, email) {
    this.user = { name, email, uid: "user-" + Date.now() };
    this.profile.name = name;
    this.profile.email = email;
    localStorage.setItem("skill_bridge_user", JSON.stringify(this.user));
    localStorage.setItem("skill_bridge_profile", JSON.stringify(this.profile));
  }

  logout() {
    this.user = null;
    localStorage.removeItem("skill_bridge_user");
  }
}

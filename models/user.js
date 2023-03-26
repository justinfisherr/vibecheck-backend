const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_info: {
    vibe_id: String,
    user_id: String,
    username: String,
    profile_img: String,
  },
  user_data: {
    top_artists: [
      {
        artist_name: String,
        artist_img: String,
        genres: [String],
      },
    ],
    top_songs: [
      {
        song_name: String,
        artist_name: String,
        song_img: String,
        genres: [String],
        preview_url: String,
        url: String,
      },
    ],
    top_genres: { type: Map, of: Object },
    total_genres: Number,
  },
});

module.exports = mongoose.model("User", userSchema);

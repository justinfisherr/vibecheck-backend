class TopItem {
  constructor(user1, user2, type) {
    this.user1 = user1;
    this.user2 = user2;
    this.type = type;
  }
  getUser1() {
    switch (this.type) {
      case "Artist":
        return this.user1.user_data.top_artists.map(
          (artist) => artist.artist_name
        );
        break;
      case "Genre":
        const myGenres = this.user1.user_data.top_genres;
        const sortedMap = [...myGenres.entries()].sort(
          (a, b) => b[1].val - a[1].val
        );
        return sortedMap.map((pair) => pair[0]);
        break;
      case "Song":
        return this.user1.user_data.top_songs.map(
          (song) => `${song.song_name}  ${song.artist_name}`
        );
        break;
    }
  }

  getUser2() {
    switch (this.type) {
      case "Artist":
        return this.user2.user_data.top_artists.map(
          (artist) => artist.artist_name
        );
        break;
      case "Genre":
        const myGenres = this.user2.user_data.top_genres;
        const sortedMap = [...myGenres.entries()].sort(
          (a, b) => b[1].val - a[1].val
        );
        return sortedMap.map((pair) => pair[0]);
        break;
      case "Song":
        return this.user2.user_data.top_songs.map(
          (song) => `${song.song_name}  ${song.artist_name}`
        );
        break;
    }
  }

  createObj(i, weight, genre = "") {
    switch (this.type) {
      case "Artist":
        return {
          artist_name: this.user1.user_data.top_artists[i].artist_name,
          artist_img: this.user1.user_data.top_artists[i].artist_img,
          genres: this.user1.user_data.top_artists[i].genres,
          weight: weight,
        };
        break;
      case "Genre":
        return {
          genre: genre,
          weight: weight,
        };
        break;
      case "Song":
        return {
          song_name: this.user1.user_data.top_songs[i].song_name,
          artist_name: this.user1.user_data.top_songs[i].artist_name,
          song_img: this.user1.user_data.top_songs[i].song_img,
          url: this.user1.user_data.top_songs[i].url,
          preview: this.user1.user_data.top_songs[i].preview_url,
          weight: weight,
        };
        break;
    }
  }
}

module.exports = TopItem;

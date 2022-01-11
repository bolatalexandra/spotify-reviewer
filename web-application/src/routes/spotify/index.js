/* path: /spotify */

const router = require('express').Router();
const request = require('request');

const env = require('../../environment');
const { isAuthorized, isSpotifyAuthorized } = require('../../session');

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi();

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

router.get('/songs', isAuthorized, isSpotifyAuthorized, (req, res) => {
    env.log('GET', `${env.WA.URI}/spotify/songs`);

    const { user } = req.session;
    const renderData = {
        email: user.email,
        currentPage: 'songs',
        spotify: {
            href: user.spotify.href,
            name: user.spotify.name,
            picture: user.spotify.picture
        }
    };

    let temporary = [];

    spotifyApi.setAccessToken(user.spotify.token);

    spotifyApi.getMySavedTracks({ limit: 50 })
        .then(data => {
            const d = data.body;

            for (const i of d.items) {
                const song = {
                    id: i.track.id,
                    name: i.track.name,
                    artists: [],
                    preview: i.track.preview_url
                };

                for (const j of i.track.artists) {
                    song.artists.push({
                        id: j.id,
                        name: j.name
                    });
                    // maximum 3 artists per song
                    if (song.artists.length > 2) {
                        break;
                    }
                }

                temporary.push(song);
            }

            renderData.spotify.songs = temporary;

            res.render('home', renderData);
        })
        .catch(err => {
            console.error(err);
        });
});

router.get('/songs/:id', isAuthorized, isSpotifyAuthorized, async (req, res) => {
    env.log('GET', `${env.WA.URI}/spotify/songs/${req.params.id}`);

    const { user } = req.session;
    const renderData = {
        email: user.email,
        currentPage: 'songs',
        spotify: {
            href: user.spotify.href,
            name: user.spotify.name,
            picture: user.spotify.picture
        }
    };
    spotifyApi.setAccessToken(user.spotify.token);

    const trackId = req.params.id;

    try {
        const spotifyResponse = await spotifyApi.getTrack(trackId);
        if (!spotifyResponse.body) {
            throw Error(`No body for current data of song ${trackId}!`);
        }

        const data = spotifyResponse.body;

        renderData.spotify.activeSong = {
            id: data.id,
            album: {
                cover: data.album.images[0].url,
                name: data.album.name,
                href: data.album.external_urls.spotify
            },
            name: data.name,
            href: data.external_urls.spotify,
            popularity: data.popularity,
            preview: data.preview_url,
            artists: data.artists.map(artist => ({
                name: artist.name,
                href: artist.external_urls.spotify
            })),
            comments: []
        }

        request.get(`${env.UCS.URI}/comment/${data.id}`, (error, response, body) => {
            if (error) {
                return res.render('home', renderData);
            }

            try {
                renderData.spotify.activeSong.comments = JSON.parse(body);
            } catch (err) {
                console.log(err);
            }

            console.log(renderData.spotify.activeSong)

            return res.render('home', renderData);
        });
    } catch (err) {
        return res.redirect('/spotify/songs');
    }
})

router.get('/artists', isAuthorized, isSpotifyAuthorized, (req, res) => {
    env.log('GET', `${env.WA.URI}/spotify/artists`);

    const { user } = req.session;
    const renderData = {
        email: user.email,
        currentPage: 'artists',
        spotify: {
            href: user.spotify.href,
            name: user.spotify.name,
            picture: user.spotify.picture
        }
    };

    let temporary = [];

    spotifyApi.setAccessToken(user.spotify.token);

    spotifyApi.getFollowedArtists({  limit: 20 })
        .then((data) => {
            const d = data.body.artists;

            for (const i of d.items) {
                const o = {
                    href: i.external_urls.spotify,
                    genres: i.genres,
                    id: i.id,
                    name: i.name
                };

                let index = i.images.length - 1;
                while (i.images[index].width < 160) {
                    index--;
                }
                o.picture = i.images[index].url;

                temporary.push(o);

            }

            renderData.spotify.artists = shuffle(temporary);

            res.render('home', renderData)
        })
        .catch(err => {
            console.error(err);
        });
});

router.get('/albums', isAuthorized, isSpotifyAuthorized, (req, res) => {
    env.log('GET', `${env.WA.URI}/spotify/albums`);

    const { user } = req.session;
    const renderData = {
        email: user.email,
        currentPage: 'albums',
        spotify: {
            href: user.spotify.href,
            name: user.spotify.name,
            picture: user.spotify.picture
        }
    };

    let temporary = [];

    spotifyApi.setAccessToken(user.spotify.token);

    spotifyApi.getMySavedAlbums({ limit: 50 })
        .then(data => {
            const d = data.body;

            for (const i of d.items) {
                const album = {
                    id: i.album.id,
                    href: i.album.external_urls.spotify,
                    name: i.album.name,
                    label: i.album.label,
                    // popularity: i.album.popularity,
                    // total_tracks: i.album.total_tracks,
                    artists: []
                };

                for (const j of i.album.artists) {
                    const artist = {
                        id: j.id,
                        href: j.external_urls.spotify,
                        name: j.name
                    };
                    album.artists.push(artist);
                }

                let index = i.album.images.length - 1;
                while (i.album.images[index].width < 160) {
                    index--;
                }
                album.picture = i.album.images[index].url;

                temporary.push(album);
            }

            renderData.spotify.albums = temporary;

            res.render('home', renderData);
        })
        .catch(err => {
            console.error(err);
        });
});

router.get('/playlists', isAuthorized, isSpotifyAuthorized, async (req, res) => {
    env.log('GET', `${env.WA.URI}/spotify/playlists`);

    const { user } = req.session;
    const renderData = {
        email: user.email,
        currentPage: 'playlists',
        spotify: {
            href: user.spotify.href,
            name: user.spotify.name,
            picture: user.spotify.picture
        }
    };

    let temporary = [];

    console.log(user)

    spotifyApi.setAccessToken(user.spotify.token);

    spotifyApi.getUserPlaylists(undefined)
        .then(data => {
            const d = data.body;
            console.log(d)

            for (const i of d.items) {
                const playlist = {
                    name: i.name,
                    href: i.external_urls.spotify,
                    id: i.id,
                    picture: undefined
                };
                if (i.images.length > 0) {
                    playlist.picture = i.images[0].url
                }
                temporary.push(playlist);
            }

            renderData.spotify.playlists = temporary;

            console.log(renderData.spotify)

            res.render('home', renderData);

        }, err => {
            console.error(err);
        });
});

router.post('/comment', isAuthorized, (req, res) => {
    env.log('POST', `${env.WA.URI}/spotify/comment`);

    if (!req.body.songId || !req.body.comment) {
        return res
            .status(400)
            .json({ message: 'No "songId" or "comment" specified!'});
    }

    const data = {
        user: {
            email: req.session.user.email,
            name: req.session.user.spotify.name,
            profile: req.session.user.spotify.picture
        },
        song: {
            id: req.body.songId
        },
        comment: req.body.comment,
    }

    request.post(`${env.UCS.URI}/comment`, { json: data }, (error, response, body) => {
        if (error) {
            return res.status(500).json({ message: error });
        }

        if (response.statusCode !== 201) {
            return res.status(response.statusCode).json(body);
        }

        try {
            const { commentId } = body;
            return res
                .status(200)
                .json({ message: 'Comment created!', commentId });
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    });
})

router.delete('/comment', isAuthorized, (req, res) => {
    env.log('DELETE', `${env.WA.URI}/spotify/comment`);

    if (!req.body.songId || !req.body.commentId) {
        return res
            .status(400)
            .json({ message: 'No "songId" or "commentId" specified!'});
    }

    const data = {
        user: {
            email: req.session.user.email,
        },
        song: {
            id: req.body.songId
        },
        comment: {
            id: req.body.commentId
        },
    }

    request.delete(`${env.UCS.URI}/comment`, { json: data }, (error, response, body) => {
        if (error) {
            return res.status(500).json({ message: error });
        }

        return res
            .status(200)
            .json({ message: 'Comment deleted!' });
    });
})

module.exports = router;
-- Users: id, password (BCrypt hashed), role, email
-- admin@user.com, password: masterkey
-- user1@user.com, password: userpassword
INSERT INTO users (id, password, role, username, full_name, phone, enabled) VALUES
(1, '$2a$10$jlT2BqziFJsVMpLUIEstIuV0yMG8Yze.wjD66G4JhfLruwNYakNc.', 'ADMIN', 'admin@user.com', 'Admin User', '+15555550100', TRUE),
(2, '$2a$10$64tXJNgLMp5m78Krvn964uQRkuFGgLdjJZYpeQrItBzBpgLWmPZ/a', 'CUSTOMER', 'user1@user.com', 'Customer User', '+15555550101', TRUE);

-- Movies: title, cast, director, producer, synopsis, poster_url, reviews, category, mpaa_rating, showtime, status, trailer_picture, trailer_video
INSERT INTO movie (title, cast, director, producer, synopsis, poster_url, reviews, category, mpaa_rating, showtime, status, trailer_picture, trailer_video) VALUES
('Demon Slayer: Infinity Castle', 'Natsuki Hanae, Akari Kit, Hiro Shimono, Saori Hayami', 'Haruo Sotozaki', 'Akifumi Fujio, Masanori Miyake, Yma Takahashi', 'The Demon Slayer Corps are drawn into the Infinity Castle, where Tanjiro and the Hashira battle powerful Upper Rank demons in a final confrontation against Muzan Kibutsuji.', 'https://res.cloudinary.com/dvucimldu/image/upload/v1759469874/onesheet_qz7tj5.jpg', 'Visually stunning and emotionally powerful — a thrilling continuation for fans.', 'Anime / Action', 'R', '2025-09-12 15:30:00', 'NOW_PLAYING', 'https://res.cloudinary.com/dvucimldu/image/upload/v1760291716/Demon-Slayer_-Kimetsu-no-Yaiba-Infinity-Castle-Theatrical-Date-Poster-US-scaled-e1741205421782_db5ys0.jpg', 'https://www.youtube.com/watch?v=BOlnreYAoGU'),
('Weapons', 'Pedro Pascal, Julia Garner, Josh Brolin', 'Zach Cregger', 'New Line Cinema', 'An interrelated horror epic exploring human violence and terror.', 'https://res.cloudinary.com/dvucimldu/image/upload/v1759469930/MV5BNTBhNWJjZWItYzY3NS00M2NkLThmOWYtYTlmNzBmN2UxZWFjXkEyXkFqcGc._V1_FMjpg_UX1000__fsm2p4.jpg', 'Highly anticipated after Barbarian.', 'Horror/Thriller', 'R', '2025-11-01 17:00:00', 'NOW_PLAYING', 'https://i.ytimg.com/vi/OpThntO9ixc/maxresdefault.jpg', 'https://youtu.be/OpThntO9ixc?si=D27EJ0dROPHjplLi'),
('The Conjuring: Last Rites', 'Vera Farmiga, Patrick Wilson, Ron Livingston', 'James Wan', 'New Line Cinema', 'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence.', 'https://res.cloudinary.com/dvucimldu/image/upload/v1759469900/new-poster-for-the-conjuring-last-rites-v0-4a68gyttrsif1_x6jhgi.webp', 'One of the scariest modern horror movies.', 'Horror', 'R', '2025-10-10 16:00:00', 'NOW_PLAYING', 'https://i.ytimg.com/vi/bMgfsdYoEEo/maxresdefault.jpg', 'https://youtu.be/bMgfsdYoEEo?si=_rFOtozr9cNpVM7o'),
('The Strangers', 'Liv Tyler, Scott Speedman', 'Bryan Bertino', 'Rogue Pictures', 'A couple staying in an isolated vacation home are terrorized by masked intruders.', 'https://res.cloudinary.com/dvucimldu/image/upload/v1759469953/A1yhOaDDXiL_ozvoqu.jpg', 'Praised for suspense and atmosphere.', 'Horror/Thriller', 'R', '2025-10-05 18:00:00', 'NOW_PLAYING', 'https://i.ytimg.com/vi/3pZUQmZdOi4/maxresdefault.jpg', 'https://youtu.be/3pZUQmZdOi4?si=pu5QgKfeHHlUGDO1'),
('Fantastic Four', 'Pedro Pascal, Vanessa Kirby, Joseph Quinn, Ebon Moss-Bachrach', 'Matt Shakman', 'Marvel Studios', 'Marvel''s first family of superheroes face cosmic threats together.', 'https://res.cloudinary.com/dvucimldu/image/upload/v1759469715/fantastic_4_1_sheet_new_cta_dbb14854_lbs4o7.jpg', 'Fans are excited to see the team join the MCU.', 'Superhero/Action', 'PG-13', '2025-12-20 13:30:00', 'NOW_PLAYING', 'https://i.ytimg.com/vi/AzMo-FgRp64/maxresdefault.jpg', 'https://youtu.be/AzMo-FgRp64?si=tTFwA4R-y6YkzJ_n'),
('Predator: Badlands', 'Elle Fanning, Dimitrius Schuster-Koloamatangi', 'Dan Trachtenberg', 'John Davis, Brent O''Connor, Marc Toberoff, Dan Trachtenberg, Ben Rosenblatt', 'A young Predator outcast and a synth ally battle threats on the deadliest planet.', 'https://m.media-amazon.com/images/M/MV5BNTdjZGUxMTItNjRkNS00N2VhLWE4MjMtMjVhODMwMGIxNjUwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 'Franchise pivot; IMAX rollout.', 'Sci-Fi/Action/Thriller', 'PG-13', '2025-11-07 19:00:00', 'COMING_SOON', 'https://i.ytimg.com/vi/43R9l7EkJwE/maxresdefault.jpg', 'https://youtu.be/43R9l7EkJwE?si=LqkQtZkrYtqge7k6'),
('The Running Man', 'Glen Powell, Josh Brolin, Emilia Jones, Lee Pace', 'Edgar Wright', 'Paramount Pictures', 'Deadly game show turns contestants into prey in a near-future dystopia.', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/49/The_Running_Man_2025_poster.jpg/250px-The_Running_Man_2025_poster.jpg', 'CinemaCon crowd-pleaser; premium formats.', 'Action/Sci-Fi/Thriller', 'Not Yet Rated', '2025-11-14 19:00:00', 'COMING_SOON', 'https://i.ytimg.com/vi/9fqusNzkmzs/maxresdefault.jpg', 'https://youtu.be/9fqusNzkmzs?si=zo9JpR4fHX-af7uZ'),
('Wicked: For Good', 'Cynthia Erivo, Ariana Grande, Jonathan Bailey, Jeff Goldblum, Michelle Yeoh', 'Jon M. Chu', 'Marc Platt', 'Glinda and Elphaba''s story concludes in the second chapter of the epic musical.', 'https://m.media-amazon.com/images/M/MV5BYTI3MGM3ZDItMjI2My00NGQxLWEzMWMtNzQ1NGQ1ZWU5ODU2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 'New original songs; wide premium rollout.', 'Musical/Fantasy', 'PG', '2025-11-21 19:00:00', 'COMING_SOON', 'https://i.ytimg.com/vi/VHP4o3xeIMU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDmzJskgqphGmuO6WUdWOXRMVprTA', 'https://youtu.be/VHP4o3xeIMU?si=tdXNgqXUWXC_HuAA'),
('Zootopia 2', 'Ginnifer Goodwin, Jason Bateman, Idris Elba, Shakira, Ke Huy Quan', 'Jared Bush, Byron Howard', 'Yvett Merino', 'Judy and Nick dive into a new case across the mammal metropolis.', 'https://upload.wikimedia.org/wikipedia/en/6/6a/Zootopia_2_%282025_film%29.jpg', 'New song “Zoo” teased; Michael Giacchino score.', 'Animation/Comedy/Adventure', 'Not Yet Rated', '2025-11-26 14:00:00', 'COMING_SOON', 'https://i.ytimg.com/vi/BjkIOU5PhyQ/maxresdefault.jpg', 'https://youtu.be/BjkIOU5PhyQ?si=1CnleT1fsrL8jypF'),
('Five Nights at Freddy''s 2', 'Josh Hutcherson, Matthew Lillard, Megan Fox (voice), Elizabeth Lail', 'Emma Tammi', 'Blumhouse, Universal', 'New animatronics, new shift, same nightmare.', 'https://i.redd.it/h401uc8jsduf1.png', 'Bigger scope teased at NYCC/BlumFest.', 'Horror', 'PG-13', '2025-12-05 19:00:00', 'COMING_SOON', 'https://i.ytimg.com/vi/dSDpoobO6yM/maxresdefault.jpg', 'https://youtu.be/dSDpoobO6yM?si=P9DGBrNjAaXd2D-Q');
-- showtimes: movie_id, show_date, show_time
INSERT INTO showtimes (movie_id, show_date, show_time) VALUES
(1, '2025-10-14', '17:00:00'),
(1, '2025-10-14', '20:00:00'),
(1, '2025-10-15', '18:30:00'),
(1, '2025-10-16', '19:30:00'),
(2, '2025-10-15', '19:00:00'),
(2, '2025-10-16', '21:30:00'),
(2, '2025-10-17', '22:00:00'),
(3, '2025-10-14', '20:00:00'),
(3, '2025-10-15', '20:30:00'),
(3, '2025-10-17', '19:30:00'),
(4, '2025-10-16', '21:00:00'),
(4, '2025-10-17', '22:00:00'),
(4, '2025-10-18', '23:00:00'),
(5, '2025-10-15', '18:00:00'),
(5, '2025-10-16', '18:00:00'),
(5, '2025-10-18', '20:00:00');

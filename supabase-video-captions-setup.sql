-- Video Review Captions
-- Run this in Supabase SQL Editor AFTER supabase-video-reviews-setup.sql
--
-- Adds closed captions to video reviews. Captions are stored as WebVTT and
-- rendered via a <track> element, which gives the native player its CC button
-- so a viewer can switch them off.
--
-- The admin panel accepts SRT or VTT and converts to VTT on save. A transcript
-- with no timestamps cannot be used: cue timings can't be invented.

-- =====================================================
-- STEP 1: Add the captions column
-- =====================================================

ALTER TABLE video_reviews ADD COLUMN IF NOT EXISTS captions_vtt TEXT;

-- =====================================================
-- STEP 2: Captions for David Raff's testimonial
-- =====================================================
-- Transcribed from the audio (Descript), so the cue timings are real.
-- Filler words removed and the name/company corrected for readability.

UPDATE video_reviews
SET captions_vtt = $vtt$WEBVTT

1
00:00:03.127 --> 00:00:08.788
Hi, my name is David Raff, and I am
Director of Operations at Savor Our City.

2
00:00:09.368 --> 00:00:17.688
Neaz Morshed asked me to write a
testimonial on his behalf, and I decided

3
00:00:17.688 --> 00:00:23.298
to go a step further and give a video
testimonial to show my appreciation,

4
00:00:23.767 --> 00:00:28.767
for what he's meant for me
personally, as well as our company.

5
00:00:29.822 --> 00:00:35.492
I hired Neaz as an executive
assistant about three years ago.

6
00:00:35.692 --> 00:00:40.172
Our company is an event
planner, Savor Our City.

7
00:00:40.511 --> 00:00:47.471
We primarily have dealt with large
companies or medium-sized companies

8
00:00:47.512 --> 00:00:54.002
trying to put on some team and team
bonding and team building activities.

9
00:00:54.562 --> 00:00:59.732
And we recently, we branched
out to offering an events

10
00:00:59.742 --> 00:01:01.591
for the general public as well.

11
00:01:02.312 --> 00:01:11.421
Neaz has been very invaluable
to our team as far as helping to

12
00:01:11.721 --> 00:01:17.141
helping me with the day-to-day operations
of managing all the different facets of

13
00:01:17.152 --> 00:01:22.582
the company, from maintaining our servers
and dealing with our system administrators

14
00:01:22.591 --> 00:01:28.861
to some of the programmers, helping me
with streamlining some of our operations

15
00:01:28.861 --> 00:01:34.551
and keeping track of everything and
all the cost of goods sold, everything

16
00:01:34.561 --> 00:01:41.581
from our experiences as far as
all the different facets of each

17
00:01:41.622 --> 00:01:48.292
individual corporate and team
bonding experience that we offer to

18
00:01:48.332 --> 00:01:56.571
to companies and what it entails to
execute and fulfill these experiences.

19
00:01:56.881 --> 00:02:02.851
So he has been tremendous at picking
up all the different instructions

20
00:02:02.851 --> 00:02:07.711
that I have and being able to
run with them without having to

21
00:02:07.721 --> 00:02:11.841
be constantly told what to do.

22
00:02:12.271 --> 00:02:18.711
So also, I have to say that he
goes above and beyond as far as

23
00:02:18.721 --> 00:02:25.651
trying to please me and do everything
he can to exceed my expectations.

24
00:02:26.051 --> 00:02:31.161
So he, he is taking part in a
lot of different facets of the

25
00:02:31.161 --> 00:02:33.841
company, as I kind of alluded to earlier.

26
00:02:34.111 --> 00:02:40.302
He's even been able to produce
some videos, edit some videos, and

27
00:02:40.332 --> 00:02:46.002
and create some great finished
product of our events that we give as

28
00:02:46.022 --> 00:02:48.701
keepsake videos to our corporate clients.

29
00:02:49.921 --> 00:02:54.341
The latest event that we did
that was geared towards the

30
00:02:54.341 --> 00:02:57.041
general public was a great success.

31
00:02:57.041 --> 00:03:02.771
We had over two hundred and fifty people
show up, and everybody was flabbergasted

32
00:03:02.781 --> 00:03:05.741
as far as what a great event it was.

33
00:03:05.742 --> 00:03:09.521
We had nothing but five-star reviews.

34
00:03:09.846 --> 00:03:15.696
Concerning the event, it was a ton of
work and preparation for creating a

35
00:03:15.706 --> 00:03:20.896
brand new software to sell tickets, some
of the different features that we wanted

36
00:03:20.896 --> 00:03:28.066
to do for our sponsors and
personalizing all the email confirmation

37
00:03:28.115 --> 00:03:30.296
tickets and the ticket itself.

38
00:03:30.456 --> 00:03:34.695
He took the lead as far as
software testing with a team

39
00:03:34.695 --> 00:03:37.335
of testers underneath him.

40
00:03:38.286 --> 00:03:45.136
I'll tell you, so Neaz really has
exceeded all my expectations, and he

41
00:03:45.166 --> 00:03:52.695
can really be a valuable asset for any
business in far as very well-rounded in

42
00:03:52.695 --> 00:03:55.655
different facets of business.

43
00:03:55.995 --> 00:04:01.656
Marketing, he even took the lead in some
of the marketing campaigns grassroots

44
00:04:01.656 --> 00:04:07.685
guerrilla marketing from going on
to different meeting groups and

45
00:04:07.695 --> 00:04:12.866
Reddit, and he was responsible for
getting some ticket sales all on his own.

46
00:04:13.545 --> 00:04:18.526
So I couldn't be happier
that he's on our team, and he

47
00:04:18.526 --> 00:04:20.495
will continue to be on our team.

48
00:04:20.995 --> 00:04:28.125
And right now we currently don't
have as much work for him over the

49
00:04:28.126 --> 00:04:34.915
last several months, and so he's
looking to get some more work, and

50
00:04:34.916 --> 00:04:40.706
i wholeheartedly am supporting
him on this venture, and I would

51
00:04:40.736 --> 00:04:45.905
definitely recommend him if you
are someone that's looking for some

52
00:04:45.905 --> 00:04:48.566
help in any facet of your business.

53
00:04:49.215 --> 00:04:54.985
That's it for now and I'm
welcome-- if anybody has

54
00:04:54.986 --> 00:04:58.575
any questions, you can certainly
reach out to me, and I'd

55
00:04:58.585 --> 00:05:03.755
be happy to discuss Neaz's
qualifications at further length.

56
00:05:04.425 --> 00:05:08.655
Thank you for your attention
on this, and take care.
$vtt$
WHERE client_name = 'David Raff';

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT
  client_name,
  (captions_vtt IS NOT NULL) AS has_captions,
  length(captions_vtt) AS caption_bytes
FROM video_reviews
ORDER BY order_index;

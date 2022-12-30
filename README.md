# Dominux Go Server

##### [The Go game's](<https://en.wikipedia.org/wiki/Go_(game)>) implementation with some brand new features.

</br>

<p align="center">
  <a href="https://github.com/AstroNvim/AstroNvim/pulse">
    <img src="https://img.shields.io/github/last-commit/Dominux/spherical-go?style=for-the-badge&logo=github&color=7dc4e4&logoColor=D9E0EE&labelColor=302D41"/>
  </a>
  <a href="https://github.com/catppuccin/catppuccin/stargazers">
    <img src="https://img.shields.io/github/stars/Dominux/spherical-go?style=for-the-badge&logo=apachespark&color=eebebe&logoColor=D9E0EE&labelColor=302D41"/>
  </a>
</p>

</br>

![image](https://user-images.githubusercontent.com/55978340/193566975-8db1cf24-7a49-4e1f-ab57-27a404793b06.png)

---

# Table of contents

- ##### [TL/DR](#tldr)
- ##### [Idea and prerequesities](#idea-and-prerequesities)
- ##### [Spherical fields design](#spherical-fields-design)
- ##### [Algorithm](#algorithm)
- ##### [Tech stack](#tech-stack)
- ##### [Entities](#entities)
- ##### [Future plans](#future-plans)

---

# :pinching_hand: TL/DR

The brand new features this server offers are rather [UX](https://en.wikipedia.org/wiki/User_experience) ones and they neither break original rules nor add new ones in a game process. They contain at this moment:

- Various spherical game fields
- [VR](https://en.wikipedia.org/wiki/Virtual_reality) game mode

Without any other words, just try it [right here, right now](https://dominux.github.io/spherical-go/)

</br>

# :bulb: Idea and prerequesities

> The idea of Go is to be abstract as much as possible

[The Go game](<https://en.wikipedia.org/wiki/Go_(game)>) itself has a really long history, maybe not by rules changes, but by just it's time of existence. And all this time it was only material game until the computers epoch came and enthusiasts have created a lot of it's virtual implementations.

The Go gamefield is called [goban](https://en.wikipedia.org/wiki/Go_equipment#Board). Originally it has a square shape, and looks absolutely the same as chess/checkers gameboard excluding that the last one has alternation of black and white squares (cells) when goban has white ones only.

Some Go virtual implementations support setting a custom grid size not only for both axis by a single parameter, but for each of them. With that possibility we can create not only square fields, but also rectangular ones.

The idea of the game is to be abstract as much as possible. In other words, any move should be independent as much as possible and give completely uncalculated game result. It's simply to take the life as a standard of the perfect abstractness: not determined moves and actions give people the same result every single time. It means in the life we don't have 100% working strategies you can take and use. In the life you should use your logical, abstract and critical thinking to increase your chances of getting a desired result. So, **the idea of the Go is to be as much abstract as the life itself**. With this idea Go already feels like you don't know where to go to win, especially for beginners.

Back to chess where players have a list of openings (debuts) those in a nutshell are just a sequence of moves. It also has multiple tactics, but obviously they are barely abstract. Nevertheless Go almost doesn't have such combinations. It has analog of chess openings - [joseki](https://en.wikipedia.org/wiki/J%C5%8Dseki). But each of them has a [tree](<https://en.wikipedia.org/wiki/Tree_(data_structure)>) of possible moves, so memorizing them and practicing takes a lot of efforts compared to chess take-and-use openings. Also an impact of using joseki to get victory isn't even as big as of using chess openings. Moreover, their importance was ruined by [Deep Learning bots](https://en.wikipedia.org/wiki/AlphaZero).

But Go IMHO with it's original board has limitations of abstractness we can achieve from the game itself because of the board structure. Majority of points have whole 4 [liberties](https://en.wikipedia.org/wiki/List_of_Go_terms#Liberty) as they are assumed to be. But the points of the edges have only 3 of them. The corner points have only 2 liberties. Seems really so far from the perfect abstractness doesn't it?! Moreover, the main process are built upon this strategic limitations: players start from corners, then extend their influence on edges and further - on the center. Ofc often players play some unusual moves and ruin the default sequence, but **following exactly this behavior in vast majority of cases brings victories**. And it doesn't seem to be abstract enough for us, right?

So, I've come up with the idea of using a spherical board as a solution of the problems that cause those limitations. The main point of replacing a square/rectangular boards with spherical ones are that spherical boards don't have this limitations because they simply don't have edges and corners. And the idea was following me all the years I'd played the original Go until I became able to finally implement it by using low-level programming language, such as [Rust](<https://en.wikipedia.org/wiki/Rust_(programming_language)>).

# :paintbrush: Spherical fields design

> It's logically that any perfect sphere has the same shape. The idea is to find spherical wireframe that suits us best

Using points with original amount of 4 liberties seem to be the best because it's not so less, and not too many. With less liberties stones are less safe and more easy to be eaten so players should play more safe and in the case of more liberties stones will be almost impossible to kill: players will be less carefully about their stones. So, with that limit of liberties we can immedietelly deny using such spheres as [icospheres](https://en.wikipedia.org/wiki/Geodesic_polyhedron), [dodecahedron](https://en.wikipedia.org/wiki/Dodecahedron), [truncated icosahedron](https://en.wikipedia.org/wiki/Truncated_icosahedron) and others with faces which primarily don't have 4 vertices.

I'm not a geometry expert, but found only 3 of the next spheres those primarily have faces with 4 vertives:

### UV-sphere

[UV-sphere](https://en.wikipedia.org/wiki/UV_mapping) looks like the first sphere we should have think of when it comes to spheres and so it is. It has only perfect rectangules in it and seem to be the best at first sight.

But it has poles and each of them is represented as a point. And that point has some immortality lvl we might only dream of. They have liberties amount equaled to the grid size, and it should be more than 4 in almost all the possible cases! Also such point will impact on all the stones bound to it since they have this point as their liberty.

We can ofc remove it or make the point itself disable to put stones on, but with that'll get edges. Edges we wanted to get rid of! Actually this will be like we just took a rectangular board and bent it to connect one edge with it's opposite. But other 2 edges left unconnected.

So this sphere is definitelly better then the original rectangular field, but in compare with the next ones it seems like it's only on halfway to our goal.

<p>
  <img src="/docs/images/uv_sphere_side.jpg" width="400" />
  <img src="/docs/images/uv_sphere_pole.jpg" width="400" />
</p>
<br/>

### Quad sphere

[Quad sphere](https://en.wikipedia.org/wiki/Quadrilateralized_spherical_cube) already looks in times better since it doesn't have such rudiments like edges. Bruh...

But it has it's cons too: since the quad sphere originally is just a cube which faces and edges were separated by lines in several times, it still has it's original 8 vertices. The problem is that these vertives have only 3 liberties.

But that seems to be all. Only 8 vertices with 3 liberties, and others - with 4, like we wanted.

<img src="/docs/images/quad_sphere.png" width="600" />
<br/>

### Grid sphere

Grid sphere - is a sphere, I haven't found the real name and images for. I bet they exist.

Nevertheless initially I named this sphere as "Axis sphere" cause it has stripes on all it's axis (X, Y and Z), and the stripes are paralleled to each other and their axis. But when I was looking for a way to implement this wireframe and was looking for a help in [BabylonJS forum](https://forum.babylonjs.com/) it turned that [BabylonJS](https://www.babylonjs.com/) already has this wireframe as pre-built material called "Grid Material".

This sphere actually has a similar wireframe to the previous quad sphere even if it doesn't look like that at first sight. The only differencies are in that the quad sphere's stripes aren't paralleled to each other, and that fact doesn't matter to the field parameters we care of, and also it doesn't have the cube vertices, and that fact really matters.

So, right now it looks like improved, next version of the almost perfect quad sphere so it should be the best, right?!

Actually as a field we want it's really the best in the whole list. But unfortunetely it has it's bit of unperfection too: it doesn't have cube's vertives, but still has points near their positions. And these points form a triangle, not a rectangular. It means that stones put onto these points will have less libergies. For example if you put two stones on two points of a single triangle then the third point of the triangle will be their common liberty, these two stones will have 5 liberties, not 6 like in original Go.

But yes, this limitation is the smallest of all other spheres so it's the best sphere field. _At least from the point of our goal_

There's another fact. This field has completely different distances between neighbor points in places where imagined cube edges should be. Other fields don't have such a problem.

<img src="/docs/images/grid_sphere.png" width="600" />
<br/>

# :abacus: Algorithm

> Actually it's 2 algorithms. At least I consider them this way

I have played on a several Go servers. One of them is [OGS](https://online-go.com) currently IMHO the most popular Go server (_but it's moderators are terrible and narcissistics af_). _In spite of the bad service made that aims only on making every player buy their premium features_, their algorithm seems to be excellent! Moreover they've got [it's source code opened](https://github.com/online-go/score-estimator), uhhhh... Also in [their github organisation](https://github.com/online-go) you could find all other repos, with the code for the server itself, but I don't need it since I'm originally a backend developer myself.

<img src="https://i.imgflip.com/6olwuw.jpg" title="made at imgflip.com" width="600"/>

So yeah, taking a closer look at the algo repo I mentioned before gives us some info about what it is. In a nutshell it's two algorithms: score estimator and dead stone remover.

The first one as far as I got is used after the game ends and we need auto score estimate. I can't imagine how to write such a code since at least understanding of dead and alive groups seem to be hard to describe in code. It definitely needs some sorf of AI to implement (not nessereally [ML](https://en.wikipedia.org/wiki/Machine_learning)). But for the [MVP](https://en.wikipedia.org/wiki/Minimum_viable_product) we don't need it since it's for the end of the game and players can do the stuff by themselves, and for the cases when players were so self-confident to not quit until the very end.

Dead stone remover IMHO is to deside which stones have become dead and to remove it at every move. This task seems to be hard too and needs to implement some sort of AI too (not nessereally [ML](https://en.wikipedia.org/wiki/Machine_learning)), but I did it. Actually, since the repo called "score-estimator" I think the dead stone remover algo is part of the score-estimator algo and originally it's purpose is to deside which stones are dead at the end of the game. But who cares?! I'll create my own stone remover, with blackjack and removing stones every move.

<img src="https://i.imgflip.com/6olvmv.jpg" title="made at imgflip.com" width="500"/>
<br/>

# :desktop_computer: Tech stack

> Only hyped techologies used

The library itself as was said previously is written in Rust because of it's benefits:

- [GC](<https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)>)-free language with memory safe approache is best for implementing algorithms since it uses the smallest amount of [RAM](https://en.wikipedia.org/wiki/Random-access_memory) and the smallest amount of needed [CPU](https://en.wikipedia.org/wiki/Central_processing_unit) computations (because it doesn't use computation for GC). It grants the best performance to a program,
- [Runtime](<https://en.wikipedia.org/wiki/Runtime_(program_lifecycle_phase)>)-free language without common runtime stuff like that GC, interpretor and others makes a program to have the smallest size and to increase it's performance more,
- [Static typing](https://en.wikipedia.org/wiki/Type_system#Static_type_checking) language prevents developers from missing type errors. It helps to write code that will work properly.

Static type system gives ability to use programs on this language to be compiled into [Wasm](https://en.wikipedia.org/wiki/WebAssembly) to be further used inside a webpage in a web browser. And a small program size and the best performance only increases it's benefits from using such a program from Wasm.

It also can be used as a library for any language it can compiled to. Like JS/TS with Wasm, Python with something like [PyO3](https://github.com/PyO3/pyo3) and [Maturin](https://github.com/PyO3/maturin), etc. So, **the single game lib for many languages to build a shell to use it**.

For easy interactions and cause of my belief in a absolute superiority of web techologies over desktop/mobile natives apps the example of such a shell is implemented as a web app, but you can also use it to create native apps, why not. Simple idea is to show that to try the game you don't need specific system and hardware requirements and don't need to install something - **just follow the link and that's all**. So, I used the greatest 3D JS/TS lib - [BabylonJS](https://www.babylonjs.com/). As UI framework I used [SolidJS](https://www.solidjs.com/) and UI components lib - [SUID](https://suid.io/).

# :dna: Entities

> Creating abstractions for each entity and then implement just one for each as a lifestyle

For now there are such entities as:

- Fields
- ~~Rulesets~~ _(temporaly removed)_

The lib itself contains implementations of the Grid Sphere and the Quad Sphere, with tests for each of them. But the Quad Sphere doesn't yet have frontend implementation. So, you can touch only the Grid one.

Since Go has many [rulesets](https://en.wikipedia.org/wiki/Rules_of_Go#Rulesets) we should implement them too. But for now the lib contains only the stone remover algorithm so the only rules difference among popular rulesets I know is that some of them (for example [Ing ruleset](https://en.wikipedia.org/wiki/Rules_of_Go#Ing_rules)) allow players to commit suicide moves when the majority of other rulesets ([Japanese](https://en.wikipedia.org/wiki/Rules_of_Go#Japanese_rules), [Chinese](https://en.wikipedia.org/wiki/Rules_of_Go#Chinese_rules), [American Go Association](https://en.wikipedia.org/wiki/Rules_of_Go#AGA_rules) and others) forbid such moves. The majority of other differencies among them are in score estimating so I'll need to implement all of them too once I finally am ready to develop the score estimator algorithm. For now the game uses Japanese ruleset.

# :chart_with_upwards_trend: Future plans

> When you are willing to create some new project full of killing features, you in 99% of cases have no idea what to do especially after implementing what you planned first. You just don't know what to go ahead with. But in this case it's not a simple project so there're clearly obvious plans that gotta be done next

- [Create a multiplayer](https://github.com/Dominux/DGS/issues/39) - finally creating a server, not just a webpage like now. It's definetely seems like a hardest feature to implement, but as I said before Imma a backand dev by a profession and not a gamedev, so I assume it to be not so hard for me since I already know the majority of steps to do to achieve this goal. This feature was requested by [people from reddit who tested it](https://www.reddit.com/r/rust_gamedev/comments/wmvx92/comment/ik1q10y/?utm_source=share&utm_medium=web2x&context=3) as a thing this game needs first.
- [Add settings to set background and it's resolution](https://github.com/Dominux/DGS/issues/35) - in comparing with a previous plan this one looks like a kindergarden task
- Add adequate scene and improve UI - this one is already harder than previous, but still not as hard as the first one

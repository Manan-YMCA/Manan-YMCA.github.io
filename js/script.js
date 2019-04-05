document.addEventListener("DOMContentLoaded", function(event) {
	document.querySelectorAll(".to-right").forEach(function(element) {
		element.addEventListener("click", function() {
			Reveal.right();
		});
	});

	document.querySelectorAll(".to-below").forEach(function(element) {
		element.addEventListener("click", function() {
			Reveal.down();
		});
	});

	// for navbar
	document.querySelector("#nav-btn").addEventListener("click", function() {
		var navbar = document.getElementById("navbar-links");
		if (navbar.style.height == "0px") {
			navbar.style.height = "2000px";
			// navbar.style.backgroundColor = "#222";
			navbar.style.background = "linear-gradient(#222, #9b9b9b)";
		} else {
			navbar.style.height = "0";
			navbar.style.backgroundColor = "transparent";
			navbar.style.backgroundImage = "none";
		}
	});

	Array.from(document.querySelectorAll(".links-to-subsections")).forEach(
		function(container) {
			new PerfectScrollbar(container);
		}
	);

	new PerfectScrollbar(document.querySelector("#event-details-container"));
	new PerfectScrollbar(
		document.getElementById("registeration-form-container")
	);
	new PerfectScrollbar(document.querySelector("#team-container"));

	fetchEventNames();

	clipBigNavLink();

	Reveal.addEventListener("slidechanged", function(event) {
		var container = event.currentSlide.querySelector(
			".links-to-subsections"
		);
		if (container) {
			setTimeout(() => container.classList.add("ps--focus"), 0);
			setTimeout(() => container.classList.remove("ps--focus"), 750);
			container.scrollTo({
				behavior: "smooth",
				left: 300,
				top: 0
			});
			setTimeout(function() {
				container.scrollTo({
					behavior: "smooth",
					left: -300,
					top: 0
				});
			}, 500);
		}
	});

	$(document).ready(function() {
		$(".owl-carousel").owlCarousel({
			nav: true,
			navText: [
				"<img src='./images/icons/left-arrow.svg' id='owl-nav-left-arrow' />",
				"<img src='./images/icons/right-arrow.svg' id='owl-nav-right-arrow' />"
			],
			items: 1,
			loop: true,
			mouseDrag: true,
			touchDrag: true,
			lazyLoad: true,
			dots: true,
			autoplay: 3000,
			center: true
		});
	});

	var owl = $(".owl-carousel");
	owl.on("mousewheel", ".owl-stage", function(e) {
		if (e.deltaY > 0) {
			owl.trigger("next.owl");
		} else {
			owl.trigger("prev.owl");
		}
		e.preventDefault();
	});

	registerForEventEventListener();
});

function gotoslide(x, y) {
	Reveal.slide(x, y);
	var navbar = document.getElementById("navbar-links");
	navbar.style.height = "0";
	navbar.style.backgroundColor = "transparent";
	navbar.style.backgroundImage = "none";
}

var selectEvents = [];
function EventObject(id, title) {
	this.id = id;
	this.title = title;
}

function fetchEventNames() {
	$.ajax({
		url: "https://culmyca19.herokuapp.com/events",
		type: "GET"
	})
		.done(function(data) {
			console.log("fetched events title data");
			data.forEach(function(eventData) {
				if (
					eventData.eventtype !== "NA" ||
					eventData.eventtype !== ""
				) {
					$("#events-list").append(
						'<option value="' +
							eventData._id +
							'"">' +
							eventData.title +
							"</option>"
					);
					selectEvents.push(
						new EventObject(eventData._id, eventData.title)
					);
				}
				var eventContainerId =
					"#" +
					eventData.clubname.toLowerCase().replace(/ /g, "-") +
					"-events";
				var eventsNameContainer = $(eventContainerId);
				eventsNameContainer.append(
					"<span class='nav-link event-link' data-id=" +
						eventData._id +
						">" +
						eventData.title +
						"</span>"
				);
			});
		})
		.fail(function(err) {
			console.log("error");
			console.log(err);
		})
		.always(function() {
			console.log("finished adding event titles");
			addOnClickListenerToEventLinks();
		});
}

function clipBigNavLink() {
	var links = $(".big-navigation-link");
	links.each(function() {
		var innerText = $(this).text();
		$(this).text(innerText.substring(0, 7));
	});
}

function addOnClickListenerToEventLinks() {
	document.querySelectorAll(".event-link").forEach(function(eventLink) {
		eventLink.addEventListener("click", function(e) {
			console.log("opening event...");

			// show loading gif
			var loadingGifImageGlobal = document.querySelector(
				"#loading-gif-image-global"
			);
			loadingGifImageGlobal.style.display = "block";
			loadingGifImageGlobal.style.zIndex = "999";

			// continue
			var eventId = e.target.getAttribute("data-id");
			console.log(eventId);
			$.ajax({
				url: "http://culmyca19.herokuapp.com/eventbyid",
				type: "POST",
				data: { id: eventId }
			})
				.done(function(eventData) {
					// redirect to event details section
					Reveal.slide(1, 15);

					console.log(eventData);
					// get reference to html elements
					var title = document.getElementById("ed-title");
					var id = document.getElementById("ed-id");
					var desc = document.getElementById("ed-desc");
					var eventType = document.getElementById("ed-event-type");
					var rules = document.getElementById("ed-rules");
					var timing = document.getElementById("ed-timing");
					var venue = document.getElementById("ed-venue");
					var prizes = document.getElementById("ed-prizes");
					var coord1Name = document.getElementById("coord-1-name");
					var coord2Name = document.getElementById("coord-2-name");
					var coord1Phone = document.getElementById("coord-1-phone");
					var coord2Phone = document.getElementById("coord-2-phone");
					var coordinators = document.getElementById(
						"ed-coordinators"
					);

					// variables
					var timeFrom = new Date(eventData.timing.from)
						.toString()
						.substring(0, 24);
					var timeTo = new Date(eventData.timing.to)
						.toString()
						.substring(0, 24);

					// set values
					id.textContent = eventData._id;
					title.textContent = eventData.title;
					desc.innerHTML = eventData.desc.replace(/\n/g,"<br>");
					eventType.textContent = eventData.eventtype;
					rules.innerHTML = eventData.rules.replace(/\n/g,"<br>");
					if (eventData.rules == "") {
						rules.textContent = "NA";
					}
					timing.textContent = timeFrom + " to " + timeTo;
					venue.textContent = eventData.venue;

					var prizesInnerHTML = "";
					if (
						eventData.prizes.prize1 != "NA" &&
						eventData.prizes.prize1 != ""
					) {
						prizesInnerHTML +=
							"<span class='text-white'>First: </span> <span>" +
							eventData.prizes.prize1 +
							"</span>";
						if (
							eventData.prizes.prize2 != "NA" &&
							eventData.prizes.prize2 != ""
						) {
							prizesInnerHTML +=
								"<br><span class='text-white'>Second: </span> <span>" +
								eventData.prizes.prize2 +
								"</span>";
							if (
								eventData.prizes.prize3 != "NA" &&
								eventData.prizes.prize3 != ""
							) {
								prizesInnerHTML +=
									"<br><span class='text-white'>Third: </span> <span>" +
									eventData.prizes.prize3 +
									"</span>";
							}
						}
					} else {
						prizesInnerHTML = "NA";
					}

					prizes.innerHTML = prizesInnerHTML;
					coord1Name.textContent = eventData.coordinators[0].name;
					coord2Name.textContent = eventData.coordinators[1].name;
					coord1Phone.textContent = eventData.coordinators[0].phone;
					coord2Phone.textContent = eventData.coordinators[1].phone;
					if (
						eventData.coordinators[0].name == "" ||
						eventData.coordinators[0].name == "NA"
					) {
						coord1Name.textContent = "NA";
						coord2Name.textContent = "NA";
						coord1Phone.textContent = "";
						coord2Phone.textContent = "";
					}
					if (eventData.eventtype === "NA" || eventType === "") {
						document.getElementById(
							"event-register-button"
						).style.display = "none";
					} else {
						document.getElementById(
							"event-register-button"
						).style.display = "block";
					}
				})
				.fail(function() {})
				.always(function() {
					document
						.querySelector("#event-details-container")
						.scrollTo({
							left: 0,
							top: 0
						});
					// hide loading gif
					loadingGifImageGlobal.style.display = "none";
					loadingGifImageGlobal.style.zIndex = "0";
				});
		});
	});
}

function goToRegister() {
	resetRegisterationSlide();
	Reveal.slide(0, 2);

	// get id of current event
	var eventId = document.getElementById("ed-id").textContent;
	var eventTitle = document.getElementById("ed-title").textContent;
	var eventType = document.getElementById("ed-event-type").textContent;
	// hide team size select input if event type is solo else show
	if (eventType.toLowerCase() === "solo") {
		console.log(eventType + "event");
		$("#teamMembersInputFormContainer").html("");
	} else {
		console.log(eventType + "event");
		$("#teamMembersInputFormContainer").html(
			"<div>*Other team members are not required to register. Team leader has to register on behalf of the whole team.</div>"
		);
	}
	// search id of current event in selectEvents
	var eventIndex = -1;
	for (var i = 0, l = selectEvents.length; i < l; ++i) {
		if (selectEvents[i].id == eventId) {
			eventIndex = i + 1;
			break;
		}
	}
	// set event index in select input
	if (eventIndex != -1) {
		document.getElementById("events-list").selectedIndex = eventIndex;
	}
}

function hideNavbar() {
	if (window.innerWidth < 600) {
		document.getElementById("navbar").style.display = "none";
	}
}

function showNavbar() {
	document.getElementById("navbar").style.display = "block";
}

function registerForEventEventListener() {
	registerForm = document.querySelector("#registeration-form");
	registerForm.addEventListener("submit", function(e) {
		e.preventDefault();
		var regForm = document.getElementById("registeration-form");
		var name = regForm["name"].value;
		var phone = Number(regForm["phone"].value);
		var email = regForm["email"].value;
		var college = regForm["college"].value;
		var eventid = regForm["event"].value;
		var eventname =
			regForm["event"].options[regForm["event"].selectedIndex]
				.textContent;
		var timestamp = Date.now();
		// var team = [];

		console.log(
			"phone : " + phone,
			" name : " + name,
			" email : " + email,
			" college : " + college,
			" eventid : " + eventid,
			" eventName : " + eventname
		);

		// get team member details
		// if (
		// 	document.getElementById("teamsize-select").style.display !== "none"
		// ) {
		// 	var teamSize = Number(
		// 		document.getElementById("teamsize-select").value
		// 	);
		// 	for (var i = 0; i < teamSize - 1; i++) {
		// 		var teammateName = regForm["name" + (i + 2)].value;
		// 		var teammateEmail = regForm["email" + (i + 2)].value;
		// 		team.push({
		// 			name: teammateName,
		// 			email: teammateEmail
		// 		});
		// 	}
		// }

		// store references
		var regMsg = document.querySelector("#registeration-msg");
		var loadinGifContainer = document.querySelector(
			"#loading-gif-container"
		);

		// hide registeration form, scroll to top and show loading gif
		registerForm.style.display = "none";
		document.querySelector("#registeration-form-container").scrollTo({
			left: 0,
			top: 0
		});
		loadinGifContainer.style.display = "block";

		$.ajax({
			url: "https://culmyca19.herokuapp.com/register",
			type: "POST",
			data: {
				phone: phone,
				email: email,
				college: college,
				eventid: eventid,
				eventname: eventname,
				timestamp: timestamp,
				team: '[{"name": "' + name + '"},{"email": "' + email + '"}]'
			}
		})
			.done(function(data) {
				console.log("success: " + JSON.stringify(data));
				if (data.status == "Success") {
					regMsg.textContent =
						"Congratulations, you have been registered successfully!";
					regMsg.style.color = "lightgreen";
				} else {
					regMsg.textContent = "Error: " + data.status;
					regMsg.style.color = "lightcoral";
				}
			})
			.fail(function() {
				console.log("error: " + JSON.stringify(data));
				regMsg.textContent = "Error: " + data.status;
			})
			.always(function() {
				console.log("complete");
				// hide loading gif and show result
				loadinGifContainer.style.display = "none";
				regMsg.style.display = "block";
				document.querySelector(
					"#registeration-form-container"
				).scrollTop = 0;
			});
	});
}

// function handleTeamMembersInputFields() {
// 	document.getElementById("teamsize-select").style.display = "block";
// 	var size = Number(document.getElementById("teamsize-select").value);
// 	var teamMembersInputFormContainer = $("#teamMembersInputFormContainer");
// 	teamMembersInputFormContainer.html("");

// 	for (var i = 0; i < size - 1; ++i) {
// 		teamMembersInputFormContainer.append(
// 			`<input type="text" name="name${i +
// 				2}" size="35" placeholder="Name (Member ${i +
// 				2})" onfocus="hideNavbar()" onfocusout="showNavbar()" required />
// 			<br />
// 			<input type="email" name="email${i +
// 				2}" size="35" placeholder="Email (Member ${i +
// 				2})" onfocus="hideNavbar()" onfocusout="showNavbar()" required />
// 			<br /><br />`
// 		);
// 	}
// }

function back() {
	console.log(window.location.hash);
	if (
		window.location.hash != "#/home-section" &&
		window.location.hash != "#/0"
	) {
		history.back();
	}
}

function resetRegisterationSlide() {
	// store references
	var registerForm = document.querySelector("#registeration-form");
	var regMsg = document.querySelector("#registeration-msg");
	var loadinGifContainer = document.querySelector("#loading-gif-container");
	// hide loading gif & registeration msg, and show registeration form
	loadinGifContainer.style.display = "none";
	regMsg.style.display = "none";
	registerForm.style.display = "block";
	// scroll to top
	document.querySelector("#registeration-form-container").scrollTo({
		left: 0,
		top: 0
	});
}

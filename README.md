#Bank Psych Prototype

This app is accessible at: https://bankpsych.herokuapp.com

GUI tool to estimate their future assets based on external market factors & their life decisions; each estimate will be saved to their profile.

Market Factors:
  See data.json for the full list included in demo
	- major tech invention
	- tech mass-production to decrease cost
	- priorities
	- favorite goods
	- goals

Future Release Features:
	- option to save decision paths to explore cost trajectory of alternate routes

	- rank priorities (entertainment, food, vacation, saving, education, house/car/college loan payments) and deselect priorities like a search filter to change your payments

	- option to add in factors like technology advancements in that category (which make things less expensive if they lead to mass production or more expensive if theyre a disruptive new tech trend)

	- option to calculate equivalent amounts of goods you could buy with x dollars based on favorite goods in user profile

	- option to add in estimated value of educational milestones to estimate payments/future income

Future Related Applications:

	- shared credit to aggregate points/rewards - points-sharing tool
	- called it - resource sharer-locator for local resources to notify your friends of a parking space you aren't using today, a deal on drinks you want them to be able to use, etc.

Algorithm Metrics:
	- estimate value of future technology as well as economic events (inventions that close gap between reality and equilibrium)
	- the algorithm can use metric percentages stored in a config file (for instance, adding a "economic recession" node impacts the rate of return on their initial investment by x%)
	
Resources
- Go JS
- Landing page template: https://startbootstrap.com/template-overviews/landing-page/

<nav class="navbar <?php if($_GET["bg"] && $_GET["bg"] === "black"): echo 'white'; else: echo "black"; endif; ?>" ng-controller="NavbarCtrl">
	<ul>
		<li class="btn"><a ng-href="#/new">Nouveau</a></li>
		<li><a ng-href="#">About</a></li>
		<li><a ng-href="#">Contact</a></li>
	</ul>
</nav>

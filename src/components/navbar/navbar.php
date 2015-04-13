<nav class="navbar <?php if($_GET["bg"] && $_GET["bg"] === "black"): echo 'white'; else: echo "black"; endif; ?>" ng-controller="NavbarCtrl">
	<ul>
		<li><a ng-href="#">Qui sommes-nous ?</a></li>
		<li><a ng-href="#" class="twitter">Twitter</a></li>
		<li><a ng-href="#" class="facebook">Facebook</a></li>
	</ul>
</nav>

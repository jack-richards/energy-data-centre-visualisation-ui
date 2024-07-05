<template>
	<div>
	  <SideBar>
		<!-- The content of each page goes here -->
		<NuxtPage />
	  </SideBar>
	</div>
  </template>
  
  <script>
  import SideBar from '~/components/SideBar.vue';
  
  export default {
	components: {
	  SideBar,
	},
  };
  </script>

  
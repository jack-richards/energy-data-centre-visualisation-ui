<template>
    <div class="flex">
        <aside
            class="sticky top-0 h-screen pr-2"
            :class="[{ 'bg-black text-gray-50': isSidebarOpen }]"
            :hidden="!isSidebarOpen"
        >
            <ul>
                <li>
                    <div class="flex items-center p-1">
                        <span v-if="isSidebarOpen" class="researcher-text text-white">rese</span>
                        <span v-if="isSidebarOpen" class="researcher-text text-orange-500">archer.</span>
                        <button @click="toggleSidebar()">
                            <span v-if="isSidebarOpen" class="arrow-change">&laquo;</span>
                        </button>
                    </div>
                </li>

                <template class="bg-black text-gray-50 block">
                    <li>
                        <router-link to="/about" class="sidebar-link"
                            ><span class="ml-1">ⓘ&nbsp;&nbsp;&nbsp;</span>About Us</router-link
                        >
                    </li>
                    <li>
                        <router-link to="/contact" class="sidebar-link"
                            ><span class="mb-1">💬&nbsp;&nbsp;</span>Contact Us</router-link
                        >
                    </li>
                    <li>
                        <router-link to="/Annual_heat_demand_LSOA" class="sidebar-link"
                            ><span class="ml-0.5">▄█&nbsp;&nbsp;</span>Annual heat demand (LSOA)</router-link
                        >
                    </li>
                    <li>
                        <router-link to="/Energy_efficiency_improvements_costs_LA" class="sidebar-link"
                            ><span class="ml-0.5">▄█&nbsp;&nbsp;</span>Energy efficiency improvements costs
                            (LA)</router-link
                        >
                    </li>
                    <li>
                        <router-link to="/Half-hourly_profiles_of_heating_technologies" class="sidebar-link"
                            ><span class="ml-0.5">▄█&nbsp;&nbsp;</span>Half-hourly profiles of heating
                            technologies</router-link
                        >
                    </li>
                    <li>
                        <router-link to="/Thermal_characteristics" class="sidebar-link"
                            ><span class="ml-0.5">▄█&nbsp;&nbsp;</span>Thermal characteristics</router-link
                        >
                    </li>
                </template>
            </ul>
        </aside>
        <div v-show="!isSidebarOpen" class="sticky h-screen top-0 collapsed-background">
            <ul>
                <li>
                    <button class="arrow self-center text-center" style="z-index: 1" @click="toggleSidebar">
                        &raquo;
                    </button>
                </li>
                <li>
                    <router-link to="/about" class="sidebar-link"><span class="ml-2">ⓘ&nbsp;&nbsp;</span></router-link>
                </li>
                <li>
                    <router-link to="/contact" class="sidebar-link"
                        ><span class="ml-1">💬&nbsp;&nbsp;</span></router-link
                    >
                </li>
                <li>
                    <router-link to="/Annual_heat_demand_LSOA" class="sidebar-link"
                        ><span class="ml-0.5">▄█&nbsp;&nbsp;</span></router-link
                    >
                </li>
                <li>
                    <router-link to="/Energy_efficiency_improvements_costs_LA" class="sidebar-link"
                        ><span class="ml-0.5">▄█&nbsp;&nbsp;</span></router-link
                    >
                </li>
                <li>
                    <router-link to="/Half-hourly_profiles_of_heating_technologies" class="sidebar-link"
                        ><span class="ml-0.5">▄█&nbsp;&nbsp;</span></router-link
                    >
                </li>
                <li>
                    <router-link to="/Thermal_characteristics" class="sidebar-link"
                        ><span class="ml-0.5">▄█&nbsp;&nbsp;</span></router-link
                    >
                </li>
            </ul>
        </div>
        <main class="flex-1 p-2">
            <slot></slot>
        </main>
    </div>
</template>

<style scoped>
    .researcher-text {
        font-family: "Arial", sans-serif;
        font-size: 1.5rem;
        font-weight: bold;
        display: flex;
        align-items: baseline;
    }

    .arrow {
        margin-left: 15.5px;
        display: flex;
        align-items: center;
        font-size: 2.5rem;
        color: #edba21;
    }

    .arrow-change {
        margin-left: 8.5px;
        margin-bottom: 0.5rem;
        display: block;
        font-size: 2.5rem;
        color: #edba21;
    }

    .sidebar-link {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
    }

    .sidebar-link span {
        margin-right: 0.3rem;
        font-size: 1.2rem;
        color: #ffffff;
    }

    .sidebar-link:hover {
        color: #dfee0c;
        box-shadow: 0 0 10px rgba(253, 238, 12, 0.8);
    }

    .collapsed-background {
        background-color: #000000;
        left: 0px;
        z-index: 0;
        transition: transform 0.9s ease;
        transform: scale(1);
    }
</style>

<script setup>
    const isSidebarOpen = ref(true);

    const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
    };
</script>

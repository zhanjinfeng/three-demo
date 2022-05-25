<template>
    <div>
        <canvas class="webgl cursor-grab"></canvas>

        <div v-if="show" class="fixed w-full h-full z-50 top-0 left-0 flex items-center justify-center flex-col">
            <div class="bg-white p-5 rounded-lg w-2/3 h-3/4 relative overflow-hidden">
                <div class="font-medium text-xl pb-2">Trickle</div>
                <div class="h-full absolute top-0 w-full pt-14 box-border left-0">
                    <iframe
                        class="w-full h-full"
                        src="http://localhost:3000/profile/76957788663709699/76957788663726085"
                        frameborder="0"
                    ></iframe>
                </div>

                <div
                    class="absolute top-4 right-4 cursor-pointer rounded py-1 px-2 hover:bg-gray-200"
                    @click="show = false"
                >
                    Close
                </div>
            </div>
        </div>

        <div
            v-for="item in elements"
            :key="item.id"
            class="fixed p-4 btn-container cursor-pointer z-10 top-1/2 left-1/2 hidden flex-col items-center hover:-translate-y-4"
            :class="`btn-${item.id}`"
            @click="item.click"
        >
            <div class="icon rounded-full flex items-center justify-center w-10 h-10 overflow-hidden bg-white">
                <i :class="item.icon" class="text-2xl text-violet-600"></i>
            </div>
            <div
                class="description duration-300 text-violet-600 flex items-center h-0 overflow-hidden bg-white font-medium px-3 rounded-md mt-2"
            >
                {{ item.description }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Experience from '@/Experience/Experience.js';
import { onMounted, ref } from 'vue';

const openSetting = () => {
    show.value = true;
};

const elements = ref([
    {
        id: 'setting',
        icon: 'iconfont icon-setting',
        click: () => {
            openSetting();
        },
        description: 'Setting',
        position: { x: 2.8, y: 2.5, z: -3 },
    },
    {
        id: 'channel',
        icon: 'iconfont icon-team_fill',
        click: () => {
            openSetting();
        },
        description: 'Channel',
        position: { x: -3.5, y: 2, z: 2.5 },
    },
    {
        id: 'Home',
        icon: 'iconfont icon-global',
        click: () => {
            openSetting();
        },
        description: 'Home',
        position: { x: 0, y: 1, z: 0 },
    },
    {
        id: 'private',
        icon: 'iconfont icon-user',
        click: () => {
            openSetting();
        },
        description: 'Private',
        position: { x: -0.9, y: 1, z: 1.3 },
    },
]);

const show = ref(false);
onMounted(() => {
    const experience = new Experience(document.querySelector('canvas.webgl'), elements.value);

    experience.eventEmit = (a: { type: 'click'; action: 'open_trickle' }) => {
        console.log('world click', a);
        switch (a.action) {
            case 'open_trickle': {
                show.value = true;
            }
        }
    };
});
</script>

<style scoped>
.btn-container:hover .description {
    @apply h-8;
}

.btn-container.visible {
    @apply flex;
}

.icon {
    animation: float 1s ease-in infinite alternate;
}

@keyframes float {
    from {
        transform: translateY(5px);
    }

    to {
        transform: translateY(-10px);
    }
}
</style>

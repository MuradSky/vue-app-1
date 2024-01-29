import {onBeforeUnmount, onMounted, ref} from 'vue'

export function useMatchMedia(query: string) {
	const matches = ref(window.matchMedia(query).matches);

	const handleMediaChange = (event) => {
		matches.value = event.matches;
	};

	onMounted(() => {
		const mediaQueryList = window.matchMedia(query);
		mediaQueryList.addEventListener('change', handleMediaChange);

		handleMediaChange(mediaQueryList);

		onBeforeUnmount(() => {
			mediaQueryList.removeEventListener('change', handleMediaChange);
		});
	});

	return matches;
}

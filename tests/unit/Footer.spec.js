import { shallowMount } from '@vue/test-utils'
import Footer from '../../src/components/core/Footer.vue'

describe('Footer.vue Test', () => {

    const $route = {path: '/'}

    const wrapper = shallowMount(Footer, {
      mocks: {
        $route
      }
    })
    wrapper.vm.$route.path  //some/path

    // check that the title is rendered
    it('has span', () => {
      expect(wrapper.contains('span')).toBe(true)
    })
})


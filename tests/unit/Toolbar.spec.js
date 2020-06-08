import { shallowMount } from '@vue/test-utils'
import Toolbar from '../../src/components/core/Toolbar.vue'

describe('Toolbar.vue Test', () => {
  it('renders props.msg when passed', () => {
    // render the component
    const msg = 'mdi-view-dashboard'
    const wrapper = shallowMount(Toolbar, {
      propsData: { msg }
    })

    // check that the title is rendered
    expect(wrapper.text()).toMatch(msg)
  })
})

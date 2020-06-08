import { createLocalVue, shallowMount } from '@vue/test-utils';
import filters from '../../src/components/core/filters.vue'


describe('filters.vue Test', () => {
  it('renders props.msg when passed', () => {
    // render the component
    const localVue = createLocalVue();

    const msg = ''

    const wrapper = shallowMount(filters, {
      //localVue,  
      propsData: { 
        msg
      },
    //   mocks : {
    //         all_counties: {
    //             county
    //         }
    //   }
    })

    // check that the title is rendered
    expect(wrapper.text()).toMatch(msg)
  })
})

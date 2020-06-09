import { mount } from '@vue/test-utils';
import Popup ,{popupProps} from '../popup.vue';
import { overlayProps } from '../overlay/overlay.vue';
import Vue from 'vue';
let wrapper,allProps = {}; 
Object.assign(allProps,overlayProps,popupProps)
function getProps() {
  let obj = {};

  Object.keys(allProps).forEach(res => {
    if (res !== 'value') {
      obj[res] = this[res];
    }
  });
  return obj;
}
describe('popup.vue', () => {
  afterEach(function() {
    wrapper.destroy();
  });
  const component = {
    template: `<div>
                <popup v-model='popupVal' v-bind="maskProps" ></popup>
            </div>`,
    components: {
      Popup
    },
    data() {
      return {
        maskProps: getProps.apply(this),
        popupVal: this.value
      };
    },
    watch: {
      value(v) {
        this.popupVal = v;
      }
    },
    props: { ...allProps, closeable: Boolean }
  };

    it('1.render popup && overlay', async function() {
      wrapper = mount(component, { propsData: { value: true } });
      wrapper.setProps({ value: true });
      await Vue.nextTick();
      expect(wrapper.find('.popup-box').isVisible()).toBe(true);
      expect(wrapper.find('.nut-mask').isVisible()).toBe(true);

    });

    it('2.test props overlay', async function() {
      wrapper = mount(component, { propsData: { value: true, overlay: false } });
      await Vue.nextTick();
      expect(wrapper.contains('.nut-mask')).toBe(false);

    });

    it('3.test props lockScroll', async function() {
      const wrapper1 = mount(component, { propsData: { value: true } });
      const wrapper2 = mount(component, { propsData: { value: true } });
      expect(document.body.classList.contains('nut-overflow-hidden')).toBe(true);

      wrapper1.destroy();
      await Vue.nextTick();
      expect(document.body.classList.contains('nut-overflow-hidden')).toBe(true);
      wrapper2.destroy();
      await Vue.nextTick();
      expect(document.body.classList.contains('nut-overflow-hidden')).toBe(false);

    });

  it('4.test closeOnClickOverlay', async function() {
    wrapper = mount(component, { propsData: { value: true, closeOnClickOverlay: true } });
    await Vue.nextTick();
    wrapper.find('.nut-mask').trigger('click');
    await Vue.nextTick();
    const duration = wrapper.vm.duration * 1500; 
    await new Promise(resolve => {
      setTimeout(() => resolve(), duration);
    }); 
    
    expect(wrapper.find('.nut-mask').isVisible() || wrapper.find('.popup-box').isVisible()).toBe(false); 
  });
  it('5.test closeOnClickOverlay', async function() {
    wrapper = mount(component, { propsData: { value: true, closeable: true } });
    await Vue.nextTick();
    let i = wrapper.find('.nutui-popup__close-icon');
    i.trigger('click');
    await Vue.nextTick();
    await new Promise(resolve => {
      setTimeout(() => resolve(), wrapper.duration * 1000);
    });  
     
    expect(wrapper.find('.popup-box').isVisible()).toBe(false);
  });

   
  it('6.test top ', async function()  {
      wrapper = mount(component, { propsData: { value: true, position:"top"}});
      await Vue.nextTick();  
      expect(wrapper.find('.popup-box').classes()).toContain('popup-top')
  });
  it('7. zindex ',async function()  {
    wrapper = mount(component, { propsData: { value: true,zIndex:999}});
      const  wrapper2 = mount(component, { propsData: { value: true}});
      await Vue.nextTick();  
      expect(wrapper.find('.popup-box').vm.zIndex).toBe(999) 
  });
});

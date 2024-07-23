//@index('./*.vue', f=> `import ${f.name} from "${f.path}.vue";`)
import Base from "./Base.vue";
import Web from "./Web.vue";
//@endindex
export {
  //@index('./*.vue', f=> `${f.name},`)
  Base,
  Web,
  //@endindex
  //@index('./*.vue', f=> `${f.name} as Simulation${f.name},`)
  Base as Simulation,
  Web as SimulationWeb,
  //@endindex
};

// CTRL + SHIFT + P

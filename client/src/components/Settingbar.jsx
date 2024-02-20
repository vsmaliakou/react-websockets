import toolState from '../store/toolState';
import '../styles/toolbar.scss';

const Settingbar = () => {
  return (
    <div className="settingbar">
      <label htmlFor="line-width">Толщина линии</label>
      <input
        style={{ margin: '0 10px' }}
        id="line-width"
        type="number"
        min={1}
        defaultValue={1}
        max={50}
        onChange={(e) => toolState.setLineWidth(e.target.value)}
      />
      <label htmlFor="stroke-color">Цвет обводки</label>
      <input
        style={{ margin: '0 10px' }}
        id="stroke-color"
        type="color"
        onChange={(e) => toolState.setStrokeColor(e.target.value)}
      />
    </div>
  );
};

export default Settingbar;
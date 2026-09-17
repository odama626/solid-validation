import { Select } from '@kobalte/core/select';
import { useLocation } from '@solidjs/router';

type Version = { label: string; value: string; path: string; frozen?: boolean };

/**
 * v1 is a frozen static build served from /v1 and is not part of this app, so
 * switching to it is a full page load rather than a router navigation. The
 * current line and /v2 are both produced by this build.
 */
const versions: Version[] = [
  { label: 'v1 (Solid 1)', value: 'v1', path: 'v1/', frozen: true },
  { label: 'v2 (Solid 2)', value: 'v2', path: 'v2/' },
];

const base = import.meta.env.BASE_URL;

export default function VersionSwitcher() {
  const location = useLocation();

  const current = () =>
    versions.find(v => location.pathname.startsWith(`${base}${v.path}`)) ?? versions[0];

  return (
    <Select<Version>
      options={versions}
      optionValue='value'
      optionTextValue='label'
      value={current()}
      onChange={next => {
        if (!next || next.value === current().value) return;
        window.location.href = `${base}${next.path}`;
      }}
      itemComponent={props => (
        <Select.Item item={props.item}>
          <Select.ItemLabel>{props.item.rawValue.label}</Select.ItemLabel>
        </Select.Item>
      )}>
      <Select.Trigger class='secondary' aria-label='Documentation version'>
        <Select.Value<Version>>{state => state.selectedOption().label}</Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class='card'>
          <Select.Listbox />
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}

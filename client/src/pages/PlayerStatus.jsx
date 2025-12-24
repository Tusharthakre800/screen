import PlayerStatusList from '../components/PlayerStatusList';

export default function PlayerStatus() {
  return (
    <section className="bg-white rounded shadow p-4">
      <h2 className="font-semibold mb-3">Player Status</h2>
      <PlayerStatusList />
    </section>
  );
}

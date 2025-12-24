import PlaylistEditor from '../components/PlaylistEditor';

export default function Playlist() {
  return (
    <section className="bg-white rounded shadow p-4">
      <h2 className="font-semibold mb-3">Playlist Editor</h2>
      <PlaylistEditor />
    </section>
  );
}

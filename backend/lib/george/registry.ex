# This class will function as a registry for all websites and their current
# users. Whenever a user connects, it will check if an agent for that website
# already exists, and create a new one if not.
defmodule George.Registry do
  use GenServer

  # Client code

  @doc """
  Starts the registry.

  __MODULE__ refers to the current module and therefore specifies, that this
  module includes all callbacks.
  """
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, :ok, opts)
  end

  @doc """
  Looks up the bucket pid for `name` stored in `server`.

  Returns `{:ok, pid}` if the bucket exists, `:error` otherwise.
  """
  def lookup(server, name) do
    GenServer.call(server, {:lookup, name})
  end

  @doc """
  Ensures there is a bucket associated to the given `name` in `server`.
  """
  def create(server, name) do
    GenServer.cast(server, {:create, name})
  end


  ## Server-side callbacks

  # Create a new empty hash dict which is the initial state of the registry
  def init(:ok) do
    names = HashDict.new
    refs  = HashDict.new
    {:ok, {names, refs}}
  end

  # Synchronous interface which requires a response

  def handle_call({:lookup, name}, _from, {names, _} = state) do
    {:reply, HashDict.fetch(names, name), state}
  end

  def handle_call(:stop, _from, state) do
    {:stop, :normal, :ok, state}
  end

  # Asynchronous interface which does not require a response

  def handle_cast({:create, name}, {names, refs}) do
    if HashDict.has_key?(names, name) do
      # no-op
      {:noreply, {names, refs}}
    else
      # Create a new page agent
      {:ok, pid} = George.Page.start_link()
      ref = Process.monitor(pid)
      refs = HashDict.put(refs, ref, name)
      names = HashDict.put(names, name, pid)

      # return state with new names and refs
      {:noreply, {names, refs}}
    end
  end

  # Listen to system events to handle errors

  def handle_info({:DOWN, ref, :process, _pid, _reason}, {names, refs}) do
    {name, refs} = HashDict.pop(refs, ref)
    names = HashDict.delete(names, name)
    {:noreply, {names, refs}}
  end

  def handle_info(_msg, state) do
    {:noreply, state}
  end
end

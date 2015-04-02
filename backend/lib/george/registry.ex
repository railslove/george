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

  def init(:ok) do
    # Create a new empty hash dict which is the initial state of the registry
    {:ok, HashDict.new}
  end

  # Synchronous interface which requires a respons
  def handle_call({:lookup, name}, _from, names) do
    {:reply, HashDict.fetch(names, name), names}
  end

  # Asynchronous interface which does not require a response
  def handle_cast({:create, name}, names) do
    if HashDict.has_key?(names, name) do
      {:noreply, names}
    else
      {:ok, bucket} = George.Page.start_link()
      {:noreply, HashDict.put(names, name, bucket)}
    end
  end
end

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import TaskModal, { TaskData } from "../../components/TaskModal/TaskModal";
import Header from "../../components/Header/Header";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import "./BoardPage.css";

interface Assignee {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
}

interface ApiTask {
  id: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Backlog' | 'InProgress' | 'Done';
  assignee: Assignee;
}

interface BoardInfo {
  id: number;
  name: string;
  description: string;
  taskCount: number;
}

interface ApiResponse {
  data: ApiTask[];
}

interface BoardsResponse {
  data: BoardInfo[];
}

type TaskStatus = 'todo' | 'in_progress' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  description: string;
  board: string;
  boardId: string;
  assignee: string;
  assigneeId: string;
  priority: TaskPriority;
  status: TaskStatus;
}

interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

const mapStatus = (apiStatus: string): TaskStatus => {
  switch (apiStatus) {
    case 'Backlog': return 'todo';
    case 'InProgress': return 'in_progress';
    case 'Done': return 'done';
    default: return 'todo';
  }
};

const toApiStatus = (status: TaskStatus): string => {
  switch (status) {
    case 'todo': return 'Backlog';
    case 'in_progress': return 'InProgress';
    case 'done': return 'Done';
  }
};

const BoardPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boardName, setBoardName] = useState<string>('');
  const [allBoards, setAllBoards] = useState<BoardInfo[]>([]);
  const [assignees, setAssignees] = useState<Assignee[]>([]);

  const fetchBoardData = async () => {
    try {
      setLoading(true);
      const boardInfo = allBoards.find(b => b.id.toString() === id);
      const currentBoardName = boardInfo?.name || `Доска ${id}`;
      setBoardName(currentBoardName);

      const tasksResponse = await fetch(`http://localhost:8080/api/v1/boards/${id}`);
      if (!tasksResponse.ok) throw new Error(`HTTP error! status: ${tasksResponse.status}`);

      const result: ApiResponse = await tasksResponse.json();
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("Invalid data format from API");
      }

      const transformedTasks: Task[] = result.data.map(task => ({
        id: task.id?.toString() ?? '',
        title: task.title,
        description: task.description,
        board: currentBoardName,
        boardId: id || "",
        assignee: task.assignee?.fullName ?? '',
        assigneeId: task.assignee?.id?.toString() ?? '',
        priority: task.priority.toLowerCase() as TaskPriority,
        status: mapStatus(task.status)
      }));

      updateColumns(transformedTasks);

      const taskId = searchParams.get('taskId');
      if (taskId) {
        await fetchTaskDetails(taskId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskDetails = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/tasks/${taskId}`);
      if (!response.ok) throw new Error(`Failed to fetch task details`);

      const result = await response.json();
      const taskData: ApiTask = result.data;

      if (!taskData?.id || !taskData?.assignee?.id) {
        throw new Error("Некорректные данные задачи");
      }

      const boardInfo = allBoards.find(b => b.id.toString() === id);
      const currentBoardName = boardInfo?.name || `Доска ${id}`;

      const taskDetails: Task = {
        id: taskData.id.toString(),
        title: taskData.title,
        description: taskData.description,
        board: currentBoardName,
        boardId: id || "",
        assignee: taskData.assignee.fullName,
        assigneeId: taskData.assignee.id.toString(),
        priority: taskData.priority.toLowerCase() as TaskPriority,
        status: mapStatus(taskData.status)
      };

      setEditingTask(taskDetails);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Ошибка при загрузке задачи:", err);
      setError(err instanceof Error ? err.message : "Failed to load task details");
    }
  };

  const updateColumns = (tasks: Task[]) => {
    const todoTasks = tasks.filter(task => task.status === 'todo').sort(sortTasks);
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress').sort(sortTasks);
    const doneTasks = tasks.filter(task => task.status === 'done').sort(sortTasks);

    setColumns([
      { id: 'todo', title: 'To Do', tasks: todoTasks },
      { id: 'in_progress', title: 'In Progress', tasks: inProgressTasks },
      { id: 'done', title: 'Done', tasks: doneTasks }
    ]);
  };

  const sortTasks = (a: Task, b: Task) => {
    const priorityOrder: { [key in TaskPriority]: number } = {
      low: 1,
      medium: 2,
      high: 3
    };

    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    return a.title.localeCompare(b.title);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [boardsResponse, assigneesResponse] = await Promise.all([
          fetch('http://localhost:8080/api/v1/boards'),
          fetch('http://localhost:8080/api/v1/users')
        ]);

        if (!boardsResponse.ok) throw new Error('Failed to fetch boards');
        const boardsResult: BoardsResponse = await boardsResponse.json();
        setAllBoards(boardsResult.data || []);

        if (!assigneesResponse.ok) throw new Error('Failed to fetch assignees');
        const assigneesResult = await assigneesResponse.json();
        setAssignees(assigneesResult.data || []);
      } catch (err) {
        console.error('Error fetching initial data:', err);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (id && allBoards.length > 0) {
      fetchBoardData();
    }
  }, [id, allBoards, searchParams]);

  const handleTaskCreated = (updatedTask: TaskData) => {
    setColumns(prevColumns => {
      const filteredColumns = prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.filter(t => t.id !== updatedTask.id)
      }));

      return filteredColumns.map(column => {
        if (column.id === updatedTask.status) {
          return {
            ...column,
            tasks: [
              ...column.tasks,
              {
                ...updatedTask,
                id: updatedTask.id ?? "",
                assignee: assignees.find(a => a.id.toString() === updatedTask.assigneeId)?.fullName || updatedTask.assignee
              }
            ].sort(sortTasks)
          };
        }
        return column;
      });
    });

    setIsModalOpen(false);
    setEditingTask(null);
    window.history.replaceState({}, '', `/board/${id}`);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.droppableId === source.droppableId) return;

    const sourceCol = columns.find(col => col.id === source.droppableId);
    const destCol = columns.find(col => col.id === destination.droppableId);
    if (!sourceCol || !destCol) return;

    const movedTask = sourceCol.tasks.find(task => task.id === draggableId);
    if (!movedTask) return;

    const updatedTask = { ...movedTask, status: destCol.id };

    const updatedColumns = columns.map(col => {
      if (col.id === source.droppableId) {
        return { ...col, tasks: col.tasks.filter(task => task.id !== draggableId) };
      }
      if (col.id === destination.droppableId) {
        return { ...col, tasks: [...col.tasks, updatedTask].sort(sortTasks) };
      }
      return col;
    });

    setColumns(updatedColumns);

    await fetch(`http://localhost:8080/api/v1/tasks/updateStatus/${movedTask.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: toApiStatus(destCol.id) })
    });
  };

  const handleTaskClick = async (task: Task) => {
    setTimeout(() => fetchTaskDetails(task.id), 0);
  };

  if (loading) return <div className="loading-message">Загрузка задач...</div>;
  if (error) return <div className="error-message">Ошибка: {error}</div>;

  return (
    <div className="board-page">
      <Header
        onTaskCreated={handleTaskCreated}
        currentBoard={boardName}
        allAssignees={assignees}
      />

      <div className="board-container">
        <h2 className="board-title">{boardName}</h2>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="board-columns">
            {columns.map(column => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <div
                    className="board-column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h3 className="column-title">{column.title} ({column.tasks.length})</h3>
                    <div className="tasks-list">
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              className="task-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => handleTaskClick(task)}
                            >
                              <h4>{task.title}</h4>
                              <p>{task.description}</p>
                              <div className="task-meta">
                              <span 
                                  className="task-priority"
                                  data-priority={task.priority}                      
                                  >
                                {task.priority}
                              </span>                        
                                <span className="task-assignee">{task.assignee}</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
          window.history.replaceState({}, '', `/board/${id}`);
        }}
        onTaskCreated={handleTaskCreated}
        initialData={editingTask ? {
          id: editingTask.id,
          title: editingTask.title,
          description: editingTask.description,
          board: editingTask.board,
          boardId: editingTask.boardId,
          priority: editingTask.priority,
          status: editingTask.status,
          assignee: editingTask.assignee,
          assigneeId: editingTask.assigneeId
        } : undefined}
        isFromBoard={true}
        initialBoard={editingTask?.board}
        allAssignees={assignees}
      />
    </div>
  );
};

export default BoardPage;

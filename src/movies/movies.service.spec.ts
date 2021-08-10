import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('shoud return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    })
  })

  describe('getOne', () => {
    it("should return a movie", () => {
      service.create({
        title: 'TestMovie',
        genres : ['test'],
        year: 2000,
      })

      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    })
    it('should throw 404 error', () => {
      try {
        service.getOne(-1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Movie with ID -1 not found.');
      }
    })
  })

  describe('deleteOne', () => {
    it('deletes a movie', () => {
      service.create({
        title: 'TestMovie',
        genres: ['test'],
        year: 2000,
      });
      const beforDelete = service.getAll().length;
      service.deleteOne(beforDelete);
      const afterDelete = service.getAll().length;
      expect(afterDelete).toEqual(beforDelete - 1);
    });

    it('should return a 404', () => {
      try {
        service.deleteOne(-1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Movie with ID -1 not found.');
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const beforCreate = service.getAll();
      service.create({
        title: 'TestMovie',
        genres : ['test'],
        year: 2000,
      })
      const afterCreate = service.getAll();
      expect(afterCreate.length).toEqual(beforCreate.length);
      expect(afterCreate[afterCreate.length - 1].title).toEqual('TestMovie');
    })
  })

  describe("update", () => {
    it("should update a movie", () => {
      service.create({
        title: 'TestMovie',
        genres: ['test'],
        year: 2000,
      });
      const beforeMovie = service.getAll().length;
      service.update(beforeMovie, { title: 'Updated Test' });
      const afterMovie = service.getOne(beforeMovie);
      expect(afterMovie.title).toEqual('Updated Test')
    })

    it('should return a 404', () => {
      try {
        service.update(-1, { title: 'Updated Test' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Movie with ID -1 not found.');
      }
    });
  })
});
